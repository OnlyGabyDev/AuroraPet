import { apiFetch } from './api';
import { Plan, ClinicSubscription } from '../types/plan';

export const planService = {
  /**
   * Retorna os planos disponíveis na plataforma ClyvoVet SaaS
   */
  async getPlans(): Promise<Plan[]> {
    return apiFetch<Plan[]>('/plans');
  },

  /**
   * Retorna a assinatura e o uso de cotas atual da clínica
   */
  async getClinicSubscription(clinicId?: string): Promise<ClinicSubscription> {
    return apiFetch<ClinicSubscription>(
      `/clinic/subscription${clinicId ? `?clinicId=${encodeURIComponent(clinicId)}` : ''}`
    );
  },

  /**
   * Atualiza ou faz upgrade do plano da clínica
   */
  async upgradePlan(planId: string): Promise<ClinicSubscription> {
    const [plans, current] = await Promise.all([
      this.getPlans(),
      this.getClinicSubscription(),
    ]);

    const targetPlan = plans.find((p) => p.id === planId);
    if (!targetPlan) throw new Error('Plano selecionado não existe.');

    const updated: ClinicSubscription = {
      ...current,
      planId: targetPlan.id,
      planName: targetPlan.name,
      planCode: targetPlan.code,
      status: 'ACTIVE',
      limits: {
        ...current.limits,
        maxVeterinarians: targetPlan.maxVeterinarians,
        maxAdmins: targetPlan.maxAdmins,
        maxPatients: targetPlan.maxPatients,
      },
    };

    return apiFetch<ClinicSubscription>('/clinic/subscription', {
      method: 'PUT',
      body: JSON.stringify(updated),
    });
  },

  /**
   * Verifica se a clínica pode adicionar mais um veterinário com base no plano contratado
   */
  async canAddVeterinarian(currentVetsCount: number): Promise<{ allowed: boolean; limit: number }> {
    const sub = await this.getClinicSubscription();
    return {
      allowed: currentVetsCount < sub.limits.maxVeterinarians,
      limit: sub.limits.maxVeterinarians,
    };
  },
};
