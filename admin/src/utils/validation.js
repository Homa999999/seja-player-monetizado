const rules = {
  hero: (s) => {
    const errors = [];
    if (!s?.titleLine1?.trim()) errors.push('Título linha 1 é obrigatório.');
    if (!s?.subtitle?.trim()) errors.push('Subtítulo é obrigatório.');
    return errors;
  },
  course: (s) => {
    const errors = [];
    if (!s?.title?.trim()) errors.push('Título da seção é obrigatório.');
    if (!s?.description?.trim()) errors.push('Descrição é obrigatória.');
    return errors;
  },
  instructor: (s) => {
    const errors = [];
    if (!s?.name?.trim()) errors.push('Nome do professor é obrigatório.');
    if (!s?.bio?.trim()) errors.push('Biografia é obrigatória.');
    return errors;
  },
  testimonials: (s) => {
    const errors = [];
    if (!s?.title?.trim()) errors.push('Título é obrigatório.');
    (s?.items || []).forEach((t, i) => {
      if (!t.name?.trim()) errors.push(`Depoimento ${i + 1}: nome é obrigatório.`);
      if (!t.text?.trim()) errors.push(`Depoimento ${i + 1}: texto é obrigatório.`);
    });
    return errors;
  },
  offer: (s) => {
    const errors = [];
    if (!s?.currentPrice?.toString().trim()) errors.push('Preço atual é obrigatório.');
    if (!s?.productName?.trim()) errors.push('Nome do produto é obrigatório.');
    return errors;
  },
  buttons: (s) => {
    const errors = [];
    if (!s?.checkoutUrl?.trim()) errors.push('Link de checkout é obrigatório.');
    if (!s?.checkoutText?.trim()) errors.push('Texto do botão principal é obrigatório.');
    return errors;
  },
  faq: (s) => {
    const errors = [];
    if (!s?.title?.trim()) errors.push('Título da seção FAQ é obrigatório.');
    (s?.items || []).forEach((item, i) => {
      if (!item.question?.trim()) errors.push(`FAQ ${i + 1}: pergunta é obrigatória.`);
      if (!item.answer?.trim()) errors.push(`FAQ ${i + 1}: resposta é obrigatória.`);
    });
    return errors;
  },
  general: (s) => {
    const errors = [];
    if (!s?.courseName?.trim()) errors.push('Nome do curso é obrigatório.');
    if (s?.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.contactEmail)) {
      errors.push('E-mail de contato inválido.');
    }
    if (s?.contactPhone && !/^\d{10,15}$/.test(s.contactPhone)) {
      errors.push('Telefone inválido. Use DDI + número, só dígitos.');
    }
    return errors;
  }
};

export function validateSection(sectionKey, section, content) {
  if (sectionKey === 'configuracoes') {
    return rules.general(content?.general || {});
  }
  if (!sectionKey || !rules[sectionKey]) return [];
  return rules[sectionKey](section);
}
