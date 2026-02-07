// coreEngine.js
// Mirror – Deterministik Karar Motoru (AI bağımsız)

function extractAssumptions(text) {
  const assumptions = [];
  const reasoning = [];

  if (text.includes("zorundayım") || text.includes("başka yol yok")) {
    assumptions.push("Başka seçenek olmadığı varsayılıyor.");
    reasoning.push("Metinde zorunluluk ifadesi tespit edildi.");
  }

  if (text.includes("herkes") || text.includes("her zaman")) {
    assumptions.push("Durumun genelleştirildiği varsayılıyor.");
    reasoning.push("Genelleme dili kullanıldığı tespit edildi.");
  }

  if (assumptions.length === 0) {
    assumptions.push("Belirgin bir varsayım açıkça ifade edilmemiş.");
    reasoning.push("Metinde açık varsayım bulunamadı.");
  }

  return { assumptions, reasoning };
}

function identifyRisks(text) {
  const risks = [];
  const reasoning = [];

  if (text.includes("acele") || text.includes("hemen")) {
    risks.push("Aceleyle verilen karar uzun vadeli sonuçlar doğurabilir.");
    reasoning.push("Zaman baskısı ifadesi tespit edildi.");
  }

  if (text.includes("korkarım") || text.includes("endişe")) {
    risks.push("Duygusal kaygı karar kalitesini etkileyebilir.");
    reasoning.push("Duygusal risk ifadesi tespit edildi.");
  }

  if (risks.length === 0) {
    risks.push("Belirgin bir risk açıkça ifade edilmemiş.");
    reasoning.push("Metinde açık risk bulunamadı.");
  }

  return { risks, reasoning };
}

function generateAlternatives() {
  return [
    "Kararı tamamen vermek yerine küçük ve geri alınabilir bir adım atmak.",
    "Mevcut seçenekleri yeniden tanımlayıp eksik olan ihtimalleri aramak.",
    "Kararı erteleyerek yeni bilgi ve geri bildirim toplamak."
  ];
}

function calculatePressure(assumptions, risks) {
  let pressure = 1;

  if (assumptions.length > 1) pressure++;
  if (risks.length > 1) pressure++;

  if (pressure > 3) pressure = 3;
  return pressure;
}

function determineTone(pressure) {
  if (pressure === 1) return "düşük";
  if (pressure === 2) return "orta";
  return "yüksek";
}

function buildSummary(tone) {
  if (tone === "düşük") {
    return "Bu karar şu an düşük baskı altında değerlendiriliyor.";
  }
  if (tone === "orta") {
    return "Bu karar bazı varsayımlar ve riskler içeriyor. Netlik artırılabilir.";
  }
  return "Bu karar yüksek baskı altında ve dikkatle ele alınmalı.";
}

function buildReadable(assumptions, risks, alternatives) {
  return (
    "Bu karar, bazı varsayımlar ve riskler içeriyor. " +
    "Alternatifler birlikte değerlendirildiğinde daha sağlıklı bir karar alanı oluşabilir."
  );
}

function handleInput(text) {
  if (!text || text.trim().length < 3) {
    return {
      type: "silence",
      readable: "Yeterli içerik bulunmadığı için değerlendirme yapılmadı."
    };
  }

  const assumptionResult = extractAssumptions(text);
  const riskResult = identifyRisks(text);
  const alternatives = generateAlternatives();

  const pressure = calculatePressure(
    assumptionResult.assumptions,
    riskResult.risks
  );

  const tone = determineTone(pressure);

  const reasoning = [
    ...assumptionResult.reasoning,
    ...riskResult.reasoning,
    `Varsayım ve risk sayısına göre baskı seviyesi ${pressure} olarak belirlendi.`,
    `Bu nedenle ton '${tone}' olarak ayarlandı.`
  ];

  return {
    type: "decision-frame",
    pressure,
    tone,
    summary: buildSummary(tone),
    structured: {
      assumptions: assumptionResult.assumptions,
      risks: riskResult.risks,
      alternatives,
      reasoning
    },
    readable: buildReadable(
      assumptionResult.assumptions,
      riskResult.risks,
      alternatives
    )
  };
}

module.exports = { handleInput };
