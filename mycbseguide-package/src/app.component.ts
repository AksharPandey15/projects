import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface Plan {
  id: number;
  title: string;
  validity: string;
  monthlyPrice: number;
  finalPrice: number;
  originalPrice: number;
  isBestValue: boolean;
  isPackageDeal: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly plans = signal<Plan[]>([
    {
      id: 1,
      title: 'Class 7',
      validity: 'Valid till March 31, 2026',
      monthlyPrice: 300,
      finalPrice: 599,
      originalPrice: 1199,
      isBestValue: false,
      isPackageDeal: false,
    },
    {
      id: 2,
      title: 'Class 7 + Class 8',
      validity: 'Valid till March 31, 2027',
      monthlyPrice: 58,
      finalPrice: 799,
      originalPrice: 1599,
      isBestValue: false,
      isPackageDeal: true,
    },
    {
      id: 3,
      title: 'Class 7 to Class 10',
      validity: 'Valid till March 31, 2029',
      monthlyPrice: 34,
      finalPrice: 1299,
      originalPrice: 2599,
      isBestValue: true,
      isPackageDeal: true,
    },
  ]);

  readonly selectedPlanId = signal<number>(3);

  readonly selectedPlan = computed(() => {
    return this.plans().find(p => p.id === this.selectedPlanId());
  });

  selectPlan(id: number): void {
    this.selectedPlanId.set(id);
  }
}
