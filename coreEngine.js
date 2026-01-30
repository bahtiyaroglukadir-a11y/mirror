const SINGLE_QUESTION =
  "Bu kararı şimdi almamak sana ne kazandırıyor?";

const DIRECT_STATEMENT =
  "Bu sistem senin yerine karar vermez.\nKararının nasıl oluştuğunu görünür kılar.";

function silence() {
  return { type: "silence" };
}

function statement(text) {
  return { type: "statement", text };
}

function singleQuestion(state) {
  state.hasAskedSingleQuestion = true;
  return { type: "single_question", text: SINGLE_QUESTION };
}

function handleInput(input, state) {
  try {
    const { text = "", history = [] } = input;
    const t = text.toLowerCase();

    if (!t.trim()) return silence();

    if (
      t.includes("ne yapmalıyım") ||
      t.includes("sence") ||
      t.includes("karar ver")
    ) {
      return statement(DIRECT_STATEMENT);
    }

    if (t.includes(" mi ") || t.includes(" mı ") || t.includes("/")) {
      return silence();
    }

    const escapeWords = ["emin değilim", "bilmiyorum", "sonra"];
    const escapeCount = history.filter(h =>
      escapeWords.some(w => h.text.toLowerCase().includes(w))
    ).length;

    if (!state.hasAskedSingleQuestion && escapeCount >= 2) {
      return singleQuestion(state);
    }

    if (t.length < 4) return silence();

    return silence();
  } catch {
    return silence();
  }
}

module.exports = { handleInput };