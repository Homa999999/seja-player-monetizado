import { useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { useToast } from '../context/ToastContext';
import { validateSection } from '../utils/validation';

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
    const key = sectionKey || 'configuracoes';
    const target = sectionKey ? ctx.content?.[sectionKey] : ctx.content?.general;
    const errors = validateSection(key, target, ctx.content);
    if (errors.length) {
      showToast(errors[0], 'error');
      return;
    }

    try {
      await ctx.save(key, summary || `${sectionLabel} salvo`);
      showToast('Alterações salvas com sucesso!');
    } catch (err) {
      showToast(err.message || 'Erro ao salvar. Tente novamente.', 'error');
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
