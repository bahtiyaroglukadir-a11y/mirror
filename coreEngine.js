// A MODÜLÜ – KARAR ÇERÇEVESİ MOTORU
// Dil: ne soğuk ne duygusal
// Amaç: karar alanını görünür kılmak

function extractAssumptions(text) {
  const assumptions = [];

  if (text.includes("ya da") || text.includes("başka yol")) {
    assumptions.push(
      "Bu kararın yalnızca iki seçenekten ibaret olduğu varsayılıyor."
    );
  }

  if (text.match(/asla|hiç|kesinlikle/)) {
    assumptions.push(
      "Durumun değişmeyeceği veya esnek olmadığı kabul ediliyor."
    );
  }

  if (text.match(/geç kaldım|çok geç/)) {
    assumptions.push(
      "Zamanın geri döndürülemez olduğu varsayımı yapılıyor."
    );
  }

  return assumptions;
}

function identifyRisks(text) {
  const risks = [];

  if (text.match(/rahat|kolay/)) {
    risks.push(
      "Kısa vadeli rahatlık, uzun vadeli bir maliyeti gizliyor olabilir."
    );
  }

  if (text.match(/her şey|mahvolur|biter/)) {
    risks.push(
      "Sonucun olduğundan daha uç bir noktada düşünülmesi olası."
    );
  }

  if (text.match(/mecbur|başka çarem yok/)) {
    risks.push(
      "Zorunluluk hissi, başka ihtimallerin gözden kaçmasına yol açabilir."
    );
  }

  return risks;
}

function generateAlternatives(text) {
  const alternatives = [];

  alternatives.push(
    "Kararı hemen vermek yerine daha küçük bir adım atmak."
  );

  alternatives.push(
    "Mevcut seçenekleri yeniden tanımlamak."
  );

  if (!text.includes("bekle")) {
    alternatives.push(
      "Kararı erteleyerek yeni bilgi edinmek."
    );
  }

  return alternatives;
}

function buildSummary({ assumptions, risks, alternatives }) {
  if (assumptions.length === 0 && risks.length === 0) {
    return "Bu düşünce açık bir acele içermiyor, ancak yine de varsayımlar tamamen görünür olmayabilir.";
  }

  return "Bu düşünce, fark edilmeden kabul edilen varsayımlar ve bazı riskler içeriyor. Alternatifler tamamen kapanmış değil.";
}

function handleInput({ text }) {
  if (!text || text.length < 3) {
    return { type: "silence" };
  }

  const assumptions = extractAssumptions(text);
  const risks = identifyRisks(text);
  const alternatives = generateAlternatives(text);

  const summary = buildSummary({
    assumptions,
    risks,
    alternatives
  });

  return {
    type: "decision_frame",
    summary,
    structured: {
      assumptions,
      risks,
      alternatives
    },
    readable:
      summary +
      " Varsayımlar, riskler ve alternatifler birlikte değerlendirildiğinde karar alanı biraz daha netleşebilir."
  };
}

module.exports = { handleInput };
