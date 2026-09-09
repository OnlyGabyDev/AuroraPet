import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { authorizationService } from '../../src/services/authorizationService';
import { requestService } from '../../src/services/requestService';
import { PetAccessAuthorization } from '../../src/types/authorization';
import {
  AdministrativeRequest,
  RequestPriority,
} from '../../src/types/administrativeRequest';
import {
  Stethoscope,
  ShieldCheck,
  PawPrint,
  Clock,
  Plus,
  Send,
  X,
  FileText,
  Building,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from 'lucide-react-native';

export default function VetPortalPage() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const [authorizations, setAuthorizations] = useState<PetAccessAuthorization[]>([]);
  const [requests, setRequests] = useState<AdministrativeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de Nova Solicitação
  const [isNewReqModalOpen, setIsNewReqModalOpen] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqPriority, setReqPriority] = useState<RequestPriority>('NORMAL');
  const [submitting, setSubmitting] = useState(false);

  const vetId = user?.uid || 'demo-vet-spec-2';

  const loadData = async () => {
    setLoading(true);
    try {
      const [authList, reqList] = await Promise.all([
        authorizationService.getAuthorizationsByVet(vetId),
        requestService.getVeterinarianRequests(vetId),
      ]);
      setAuthorizations(authList);
      setRequests(reqList);
    } catch (e) {
      console.error('Erro ao carregar dados do portal do vet:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [vetId]);

  const handleCreateRequest = async () => {
    if (!reqTitle.trim() || !reqDesc.trim()) {
      Alert.alert('Atenção', 'Título e descrição da solicitação são obrigatórios.');
      return;
    }

    setSubmitting(true);
    try {
      await requestService.createRequest({
        veterinarianId: vetId,
        veterinarianName: user?.displayName || 'Dr. Leonardo Albuquerque',
        crmv: user?.crmv || 'CRMV-SP 38.541',
        clinicId: user?.clinicId || 'clinic-clyvo-matriz',
        clinicName: user?.clinicName || 'Clyvo Centro Médico Veterinário',
        title: reqTitle.trim(),
        description: reqDesc.trim(),
        priority: reqPriority,
      });

      setIsNewReqModalOpen(false);
      setReqTitle('');
      setReqDesc('');
      setReqPriority('NORMAL');
      loadData();
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Falha ao enviar solicitação.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando portal do médico veterinário...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* IDENTIFICAÇÃO DO VETERINÁRIO */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.profileRow}>
          <View style={[styles.vetAvatar, { backgroundColor: '#0284c7' }]}>
            <Stethoscope size={24} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeLine}>
              <View style={styles.crmvPill}>
                <Text style={styles.crmvText}>{user?.crmv || 'CRMV-SP 38.541'}</Text>
              </View>
              <View style={styles.activePill}>
                <View style={styles.greenDot} />
                <Text style={styles.activePillText}>Regular & Ativo</Text>
              </View>
            </View>
            <Text style={[styles.vetName, { color: colors.text }]}>
              {user?.displayName || 'Dr. Leonardo Albuquerque'}
            </Text>
            <Text style={[styles.vetSpecialty, { color: colors.textSecondary }]}>
              {user?.specialty || 'Cardiologia & Diagnóstico por Imagem'}
            </Text>
            <View style={styles.clinicLinkRow}>
              <Building size={13} color={colors.accent} />
              <Text style={[styles.clinicLinkText, { color: colors.textSecondary }]}>
                Vinculado a: <Text style={{ fontWeight: '700' }}>{user?.clinicName || 'Clyvo Matriz'}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* SEÇÃO 1: PACIENTES AUTORIZADOS (3FN: AUTORIZACAO_ACESSO_PET) */}
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.tagLine}>
            <ShieldCheck size={14} color="#10b981" />
            <Text style={[styles.tagText, { color: colors.accent }]}>
              Segurança 3FN • Autorização de Recurso
            </Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Pacientes com Autorização Ativa
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Você só possui permissão para consultar o prontuário dos pets abaixo com consentimento do tutor.
          </Text>
        </View>
      </View>

      <View style={styles.petsList}>
        {authorizations.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.surface }]}>
            <PawPrint size={32} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Nenhum pet autorizado no momento
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Quando um tutor conceder acesso ao prontuário médico através do CRMV, o pet aparecerá aqui.
            </Text>
          </View>
        ) : (
          authorizations.map((auth) => (
            <TouchableOpacity
              key={auth.id}
              style={[
                styles.petCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => router.push(`/(dashboard)/pets/${auth.petId}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.petIconBox}>
                <PawPrint size={20} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.petNameRow}>
                  <Text style={[styles.petCardTitle, { color: colors.text }]}>
                    {auth.petName}
                  </Text>
                  <View style={styles.authorizedBadge}>
                    <ShieldCheck size={12} color="#065f46" />
                    <Text style={styles.authorizedBadgeText}>Acesso Concedido</Text>
                  </View>
                </View>
                <Text style={[styles.petCardMeta, { color: colors.textSecondary }]}>
                  Autorizado em: {auth.authorizedAt} • Válido até: {auth.expiresAt || 'Indeterminado'}
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* SEÇÃO 2: SOLICITAÇÕES ADMINISTRATIVAS DO VET (SOLICITACAO_ADMINISTRATIVA) */}
      <View style={[styles.sectionHeader, { marginTop: 32 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Minhas Solicitações para a Clínica
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Canal formal para solicitar insumos, manutenções, ajustes de escala ou férias.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsNewReqModalOpen(true)}
          style={[styles.newReqBtn, { backgroundColor: colors.primary }]}
        >
          <Plus size={15} color="#ffffff" />
          <Text style={styles.newReqBtnText}>Nova Solicitação</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.requestsList}>
        {requests.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.surface }]}>
            <FileText size={32} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Nenhuma solicitação enviada
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Clique em "Nova Solicitação" para enviar um pedido para a diretoria da clínica.
            </Text>
          </View>
        ) : (
          requests.map((req) => (
            <View
              key={req.id}
              style={[
                styles.reqCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.reqTopRow}>
                <Text style={[styles.reqCardTitle, { color: colors.text }]}>
                  {req.title}
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        req.status === 'APPROVED'
                          ? '#ecfdf5'
                          : req.status === 'REJECTED'
                          ? '#fef2f2'
                          : '#eff6ff',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color:
                          req.status === 'APPROVED'
                            ? '#065f46'
                            : req.status === 'REJECTED'
                            ? '#991b1b'
                            : '#1e40af',
                      },
                    ]}
                  >
                    {req.status}
                  </Text>
                </View>
              </View>

              <Text style={[styles.reqCardDesc, { color: colors.textSecondary }]}>
                {req.description}
              </Text>

              {req.adminFeedback && (
                <View
                  style={[
                    styles.feedbackBox,
                    { backgroundColor: colors.surfaceSubtle },
                  ]}
                >
                  <Text style={[styles.feedbackLabel, { color: colors.accent }]}>
                    Resposta da Administração:
                  </Text>
                  <Text style={[styles.feedbackContent, { color: colors.text }]}>
                    {req.adminFeedback}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* MODAL CRIAR SOLICITAÇÃO */}
      <Modal visible={isNewReqModalOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsNewReqModalOpen(false)}>
          <Pressable
            style={[
              styles.modalCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Nova Solicitação Administrativa
              </Text>
              <TouchableOpacity onPress={() => setIsNewReqModalOpen(false)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Título do Pedido</Text>
              <TextInput
                placeholder="Ex: Ajuste de escala no plantão de domingo"
                placeholderTextColor={colors.textMuted}
                value={reqTitle}
                onChangeText={setReqTitle}
                style={[
                  styles.textInput,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
                ]}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Nível de Prioridade</Text>
              <View style={styles.prioritySelector}>
                {(['LOW', 'NORMAL', 'HIGH', 'URGENT'] as RequestPriority[]).map((p) => {
                  const isSel = reqPriority === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setReqPriority(p)}
                      style={[
                        styles.priorityOption,
                        {
                          backgroundColor: isSel ? colors.primary : colors.surfaceSubtle,
                          borderColor: isSel ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityOptionText,
                          { color: isSel ? '#ffffff' : colors.textSecondary },
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Detalhamento & Justificativa</Text>
              <TextInput
                placeholder="Descreva o motivo da solicitação, datas ou especificações técnicas..."
                placeholderTextColor={colors.textMuted}
                value={reqDesc}
                onChangeText={setReqDesc}
                multiline
                numberOfLines={4}
                style={[
                  styles.textArea,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
                ]}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsNewReqModalOpen(false)}
                style={[styles.btnCancel, { backgroundColor: colors.surfaceSubtle }]}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateRequest}
                disabled={submitting}
                style={[styles.btnSubmit, { backgroundColor: colors.primary }]}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Send size={15} color="#ffffff" />
                    <Text style={styles.btnSubmitText}>Enviar para a Clínica</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  profileCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  vetAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  crmvPill: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  crmvText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  activePillText: {
    color: '#065f46',
    fontSize: 10,
    fontWeight: '700',
  },
  vetName: {
    fontSize: 18,
    fontWeight: '800',
  },
  vetSpecialty: {
    fontSize: 12,
    marginTop: 2,
  },
  clinicLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  clinicLinkText: {
    fontSize: 11,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tagLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  petsList: {
    gap: 10,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  petIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  petCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  authorizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  authorizedBadgeText: {
    color: '#065f46',
    fontSize: 10,
    fontWeight: '700',
  },
  petCardMeta: {
    fontSize: 11,
    marginTop: 3,
  },
  newReqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newReqBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  requestsList: {
    gap: 12,
  },
  reqCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  reqTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reqCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  reqCardDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  feedbackBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  feedbackContent: {
    fontSize: 12,
  },
  emptyBox: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 12,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 360,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  textArea: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityOptionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  btnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnSubmitText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
