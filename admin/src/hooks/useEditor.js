import { useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { useToast } from '../context/ToastContext';

/** Hook para editores: carrega conteúdo e expõe save manual */
export function useEditor(sectionKey, sectionLabel) {
  const ctx = useContent();
  const { showToast } = useToast();

  useEffect(() => {
    if (!ctx.content && !ctx.loading) ctx.load();
  }, [ctx.content, ctx.loading, ctx.load]);

  const section = sectionKey ? ctx.content?.[sectionKey] : ctx.content;

  function updateSection(patchOrFn) {
    if (!sectionKey) return;
    ctx.patchContent(prev => ({
      ...prev,
      [sectionKey]: typeof patchOrFn === 'function'
        ? patchOrFn(prev[sectionKey])
        : { ...prev[sectionKey], ...patchOrFn }
    }));
  }

  function updateContent(patchOrFn) {
    ctx.patchContent(typeof patchOrFn === 'function' ? patchOrFn : () => patchOrFn);
  }

  async function handleSave(summary) {
    try {
      await ctx.save(sectionKey || 'geral', summary || `${sectionLabel} salvo`);
      showToast('Alterações salvas com sucesso!');
    } catch {
      showToast('Erro ao salvar. Tente novamente.', 'error');
    }
  }

  return {
    ...ctx,
    section,
    updateSection,
    updateContent,
    handleSave
  };
}
