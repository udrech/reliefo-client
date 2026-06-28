import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

import { CustomerService } from '@/services/customer.service';
import { MedicalHistoryRecordService } from '@/services/medicalhistoryrecord';

interface DrawingPoint {
  x: number;
  y: number;
}

interface Stroke {
  points: DrawingPoint[];
  lineWidth: number;
}

@Component({
  selector: 'app-medicalhistoryrecords-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    DialogModule,
    FormsModule,
    InputMaskModule,
    NgOptimizedImage,
    RadioButtonModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
    TooltipModule,
  ],
  templateUrl: './medicalhistoryrecords-form.html',
  styleUrl: './medicalhistoryrecords-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalhistoryrecordsForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly medicalHistoryRecordService = inject(MedicalHistoryRecordService);
  private readonly customerService = inject(CustomerService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly showHistoryTypeInfo = signal(false);

  private readonly diagramContainer = viewChild.required<ElementRef<HTMLElement>>('diagramContainer');
  private readonly diagramCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('diagramCanvas');

  private static readonly DEFAULT_DIAGRAM_IMAGE = 'body_diagram_gemini1.png';
  private static readonly DRAW_COLOR = '#dc2626';
  protected readonly lineWidth = signal(10);
  protected readonly lineWidthOptions = [5, 10, 15];

  protected readonly strokes = signal<Stroke[]>([]);

  private resizeObserver: ResizeObserver | null = null;
  private isDrawing = false;
  private currentStroke: DrawingPoint[] | null = null;

  private readonly customerId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')))
  );

  private readonly recordId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('mid')))
  );

  protected readonly typeOptions = [
    'Allergien',
    'Anamnese',
    'Befunde / Status',
    'Medikamente',
    'Therapieplan / Ziele',
    'Übungen / Empfehlungen',
    'Verlauf',
    'Vitalparameter',
    'Vorerkrankungen',
  ];

  protected readonly isNew = computed(() => !this.recordId());
  protected readonly imagePath = computed(() => {
    const imageName = this.record()?.markingsImage || MedicalhistoryrecordsForm.DEFAULT_DIAGRAM_IMAGE;
    return `images/${imageName}`;
  });

  protected readonly customer = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => this.customerService.getById(+params.get('id')!))
    )
  );

  private readonly record = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('mid');
        return id ? this.medicalHistoryRecordService.getById(Number(id)) : of(null);
      })
    )
  );

  protected readonly form = new FormGroup({
    historyDate: new FormControl<Date | null>(new Date(), { validators: Validators.required }),
    historyTime: new FormControl<Date | null>(new Date(), { validators: Validators.required }),
    historyType: new FormControl<string | null>(null),
    note: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const record = this.record();
      if (record) {
        untracked(() => {
          const timestamp = record.historyTimestamp;
          this.form.patchValue({
            historyDate: new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate()),
            historyTime: new Date(0, 0, 0, timestamp.getHours(), timestamp.getMinutes()),
            historyType: record.historyType,
            note: record.note,
          });
          if (record.markings) {
            try {
              const parsedMarkings = JSON.parse(record.markings);
              this.strokes.set(parsedMarkings);
              this.redrawAll();
            } catch (e) {
              console.error('Failed to parse markings:', e);
            }
          }
        });
      }
    });

    afterNextRender(() => {
      this.resizeCanvasToContainer();
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvasToContainer());
      this.resizeObserver.observe(this.diagramContainer().nativeElement);
    });
    this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
  }

  protected save(): void {
    if (this.form.invalid) return;
    const { historyDate, historyTime, historyType, note } = this.form.getRawValue();
    const id = this.recordId();
    const customerId = this.customerId();

    if (!customerId || !historyDate || !historyTime) return;

    const historyTimestamp = new Date(
      historyDate.getFullYear(),
      historyDate.getMonth(),
      historyDate.getDate(),
      historyTime.getHours(),
      historyTime.getMinutes()
    );

    const payload = {
      customerId: Number(customerId),
      historyTimestamp,
      historyType: historyType ?? null,
      note,
      markings: this.strokes().length > 0 ? JSON.stringify(this.strokes()) : null,
      markingsImage: this.record()?.markingsImage || MedicalhistoryrecordsForm.DEFAULT_DIAGRAM_IMAGE,
    };

    if (id) {
      this.medicalHistoryRecordService.update(Number(id), payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Eintrag aktualisiert', life: 3000 });
        this.router.navigate(['/kunden', String(customerId), 'krankengeschichte']);
      });
    } else {
      this.medicalHistoryRecordService.create(payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Eintrag erstellt', life: 3000 });
        this.router.navigate(['/kunden', String(customerId), 'krankengeschichte']);
      });
    }
  }

  protected cancel(): void {
    const customerId = this.customerId();
    if (customerId) {
      this.router.navigate(['/kunden', String(customerId), 'krankengeschichte']);
    }
  }

  protected openHistoryTypeInfo(): void {
    this.showHistoryTypeInfo.set(true);
  }

  protected getLineWidthLabel(width: number): string {
    switch (width) {
      case 5:
        return 'Schmal';
      case 10:
        return 'Mittel';
      case 15:
        return 'Breit';
      default:
        return `${width}px`;
    }
  }

  protected onImageLoad(): void {
    this.resizeCanvasToContainer();
  }

  protected onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    this.isDrawing = true;
    this.currentStroke = [this.getNormalizedPoint(event)];

    const ctx = this.diagramCanvas().nativeElement.getContext('2d');
    if (ctx) {
      const canvas = this.diagramCanvas().nativeElement;
      this.configureContext(ctx, this.lineWidth());
      const { x, y } = this.currentStroke[0];
      ctx.beginPath();
      ctx.arc(x * canvas.width, y * canvas.height, this.lineWidth() / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isDrawing || !this.currentStroke) return;

    const canvas = this.diagramCanvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previous = this.currentStroke[this.currentStroke.length - 1];
    const point = this.getNormalizedPoint(event);
    this.currentStroke.push(point);

    this.configureContext(ctx, this.lineWidth());
    ctx.beginPath();
    ctx.moveTo(previous.x * canvas.width, previous.y * canvas.height);
    ctx.lineTo(point.x * canvas.width, point.y * canvas.height);
    ctx.stroke();
  }

  protected onPointerUp(): void {
    if (!this.isDrawing || !this.currentStroke) return;
    this.isDrawing = false;
    const stroke: Stroke = {
      points: this.currentStroke,
      lineWidth: this.lineWidth(),
    };
    this.currentStroke = null;
    this.strokes.update(strokes => [...strokes, stroke]);
  }

  protected clearDrawing(): void {
    this.strokes.set([]);
    const canvas = this.diagramCanvas().nativeElement;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  }

  private resizeCanvasToContainer(): void {
    const canvas = this.diagramCanvas().nativeElement;
    const container = this.diagramContainer().nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0 || (canvas.width === width && canvas.height === height)) return;

    canvas.width = width;
    canvas.height = height;
    this.redrawAll();
  }

  private redrawAll(): void {
    const canvas = this.diagramCanvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const stroke of this.strokes()) {
      this.drawStroke(ctx, stroke);
    }
  }

  private drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
    const { points, lineWidth } = stroke;
    if (points.length === 0) return;

    const canvas = ctx.canvas;
    this.configureContext(ctx, lineWidth);

    if (points.length === 1) {
      const { x, y } = points[0];
      ctx.beginPath();
      ctx.arc(x * canvas.width, y * canvas.height, lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x * canvas.width, points[0].y * canvas.height);
    for (const point of points.slice(1)) {
      ctx.lineTo(point.x * canvas.width, point.y * canvas.height);
    }
    ctx.stroke();
  }

  private configureContext(ctx: CanvasRenderingContext2D, lineWidth: number = this.lineWidth()): void {
    ctx.fillStyle = MedicalhistoryrecordsForm.DRAW_COLOR;
    ctx.strokeStyle = MedicalhistoryrecordsForm.DRAW_COLOR;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  private getNormalizedPoint(event: PointerEvent): DrawingPoint {
    const canvas = this.diagramCanvas().nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }
}
