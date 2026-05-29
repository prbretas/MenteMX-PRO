# 💰 MenteMX Pro — Análise de Monetização e Distribuição

> Documento de análise para validação com o stakeholder do MenteMX.
> Objetivo: definir a melhor estratégia de distribuição (Google Play / Desktop) e modelo de licenciamento.

---

## Contexto

O MenteMX Pro terá duas versões:
- **Mobile (Android)** — versão principal, usada nas pistas pelos pilotos
- **Desktop (Web/Electron)** — versão de análise, usada pelo piloto ou equipe técnica

Ambas se comunicam e sincronizam dados. A questão central é: **como monetizar e controlar o acesso?**

---

## Cenário 1: App Gratuito no Google Play + Licença por Key

### Como funciona
1. O app é publicado **gratuitamente** no Google Play (qualquer pessoa pode baixar)
2. Ao abrir o app pela primeira vez, o usuário vê uma tela de boas-vindas e precisa inserir uma **Key única de ativação**
3. A Key é gerada e entregue após o pagamento (via site, PIX, ou outro canal de venda)
4. A mesma Key libera o acesso ao **Desktop** (login com Key + email)

### Vantagens
| Aspecto | Detalhe |
|---------|---------|
| Visibilidade | App aparece no Google Play para qualquer pessoa pesquisar |
| Barreira de entrada baixa | Usuário baixa sem pagar, conhece a interface antes de comprar |
| Controle total | Você controla quem tem acesso via backend (ativar/desativar keys) |
| Flexibilidade de preço | Pode criar planos (mensal, anual, vitalício) sem depender do Google |
| Sem taxa do Google (30%) | Pagamento é feito fora da loja, direto para vocês |
| Trial/Demo | Pode oferecer versão limitada (ex: 3 sessões grátis) antes de exigir a Key |

### Desvantagens
| Aspecto | Detalhe |
|---------|---------|
| Complexidade técnica | Precisa de backend para gerar, validar e gerenciar Keys |
| Suporte | Usuários podem ter dificuldade com a Key (perder, digitar errado) |
| Política do Google | O Google pode rejeitar apps que exigem pagamento externo para funcionar (risco moderado) |
| Pirataria | Keys podem ser compartilhadas (mitigável com vinculação a device ID) |

### Fluxo do Usuário
```
Google Play → Baixa grátis → Abre app → Tela de ativação
→ Insere Key (comprada via site/PIX) → App ativado
→ Mesmo Key libera Desktop (login com email + key)
```

---

## Cenário 2: App Pago no Google Play + Desktop com Key

### Como funciona
1. O app é publicado como **pago** no Google Play (ex: R$ 49,90 ou R$ 99,90)
2. Quem compra no Google Play já tem acesso imediato ao mobile
3. Após a compra, o usuário recebe uma **Key** (via email ou dentro do app) para acessar o Desktop
4. Alternativamente: o Desktop pode validar via Google Play receipt

### Vantagens
| Aspecto | Detalhe |
|---------|---------|
| Simplicidade | Usuário paga e já usa — sem etapa extra de ativação |
| Confiança | Compra via Google Play transmite segurança ao usuário |
| Sem pirataria mobile | Google Play protege o APK (DRM básico) |
| Menos suporte | Não precisa gerenciar Keys para mobile |
| Reembolso automático | Google gerencia reembolsos nos primeiros 48h |

### Desvantagens
| Aspecto | Detalhe |
|---------|---------|
| Taxa do Google (30%) | De cada R$ 100, o Google fica com R$ 30 (15% no primeiro ano para devs novos) |
| Menos flexibilidade | Difícil fazer promoções, cupons ou planos personalizados |
| Sem trial | Usuário precisa pagar antes de experimentar |
| Visibilidade menor | Apps pagos têm menos downloads que gratuitos |
| Desktop separado | Ainda precisa de um mecanismo para liberar o Desktop |

### Fluxo do Usuário
```
Google Play → Compra (R$ XX) → Baixa e usa imediatamente
→ Dentro do app: "Ativar Desktop" → Gera Key ou vincula email
→ Desktop: login com email → Validado via receipt/key
```

---

## Cenário 3 (Híbrido Recomendado): Freemium + Assinatura

### Como funciona
1. App **gratuito** no Google Play com funcionalidades básicas (registro de voltas, 1 moto)
2. Para desbloquear tudo (Analytics avançado, MX Score, Setup, Sync, Desktop): **assinatura mensal/anual**
3. Assinatura gerenciada via Google Play Billing (in-app purchase)
4. Desktop liberado automaticamente para assinantes (login com conta Google)

### Vantagens
| Aspecto | Detalhe |
|---------|---------|
| Máxima visibilidade | App gratuito = mais downloads |
| Receita recorrente | Assinatura gera receita previsível |
| Trial natural | Versão free funciona como demo |
| Sem gestão de Keys | Google gerencia tudo |
| Cross-platform | Conta Google unifica mobile e desktop |

### Desvantagens
| Aspecto | Detalhe |
|---------|---------|
| Taxa do Google (15-30%) | Aplica-se sobre assinaturas |
| Complexidade de billing | Implementar Google Play Billing API |
| Churn | Usuários podem cancelar a qualquer mês |
| Nicho pequeno | Pode não ter volume para justificar modelo de assinatura |

---

## Comparativo Resumido

| Critério | Cenário 1 (Key) | Cenário 2 (Pago) | Cenário 3 (Freemium) |
|----------|-----------------|-------------------|----------------------|
| Facilidade para o usuário | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Controle do desenvolvedor | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Receita líquida | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Proteção contra pirataria | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Visibilidade na loja | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Complexidade técnica | ⭐⭐⭐ (média) | ⭐⭐ (baixa) | ⭐⭐⭐⭐ (alta) |
| Escalabilidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## Recomendação Técnica

Para o **MVP e lançamento inicial**, recomendo o **Cenário 1 (App Gratuito + Key)** pelos seguintes motivos:

1. **Controle total** — vocês decidem preço, promoções e quem tem acesso
2. **Sem taxa do Google** — 100% da receita fica com vocês
3. **Flexibilidade** — pode migrar para assinatura depois sem quebrar nada
4. **Simplicidade de implementação** — um endpoint de validação de Key é mais simples que Google Play Billing
5. **Nicho pequeno** — com poucos usuários iniciais, gerenciar Keys manualmente é viável

### Implementação sugerida para Cenário 1

```
Backend:
- POST /api/keys/generate → Gera key única (admin)
- POST /api/keys/activate → Ativa key + vincula ao device
- GET  /api/keys/validate → Valida key no login

Modelo de dados:
- Key: { code, status, userId, deviceId, createdAt, activatedAt, expiresAt }
- Planos: one-time, monthly, yearly (campo no Key)

Segurança:
- Key vinculada a 1 device mobile + 1 desktop
- Rate limiting na validação
- Key revogável pelo admin
```

---

## Próximos Passos

1. **Validar com o dono do MenteMX** qual cenário faz mais sentido para o negócio
2. Definir o **preço** e modelo (pagamento único vs. assinatura)
3. Definir se haverá **versão trial/demo** gratuita
4. Após decisão, criar as issues de implementação do módulo de licenciamento

---

## Perguntas para Discussão

- [ ] Qual o preço-alvo? (ex: R$ 29,90/mês ou R$ 199,90 vitalício?)
- [ ] Quer oferecer trial gratuito? Se sim, por quanto tempo ou quantas sessões?
- [ ] O Desktop será obrigatório ou opcional (add-on)?
- [ ] Haverá plano para equipes (múltiplos pilotos sob uma conta)?
- [ ] Como será feita a venda? (site próprio, Instagram, indicação?)

---

*Documento gerado para análise interna — MenteMX Pro*
