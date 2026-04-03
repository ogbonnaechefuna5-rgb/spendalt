export type ParsedTransaction = {
  type: 'debit' | 'credit';
  amount: number;
  merchant?: string;
  balance?: number;
  bank?: string;
  date: Date;
  raw: string;
};

type Pattern = { regex: RegExp; type: 'debit' | 'credit'; bank: string };

const PATTERNS: Pattern[] = [
  { bank: 'GTBank',    type: 'debit',  regex: /GTB.*?(?:debited?|DR)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'GTBank',    type: 'credit', regex: /GTB.*?(?:credited?|CR)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'Access',    type: 'debit',  regex: /Access.*?(?:debit|withdrawal)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'Access',    type: 'credit', regex: /Access.*?(?:credit|deposit)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'Zenith',    type: 'debit',  regex: /Zenith.*?(?:debit|DR)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'Zenith',    type: 'credit', regex: /Zenith.*?(?:credit|CR)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'UBA',       type: 'debit',  regex: /UBA.*?(?:debited?)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'UBA',       type: 'credit', regex: /UBA.*?(?:credited?)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'FirstBank', type: 'debit',  regex: /First\s*Bank.*?(?:debit|DR)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'FirstBank', type: 'credit', regex: /First\s*Bank.*?(?:credit|CR)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  // Generic fallback
  { bank: 'Unknown',   type: 'debit',  regex: /(?:debited?|DR|withdrawal)[^\d]*([\d,]+(?:\.\d{2})?)/i },
  { bank: 'Unknown',   type: 'credit', regex: /(?:credited?|CR|deposit)[^\d]*([\d,]+(?:\.\d{2})?)/i },
];

const MERCHANT_PATTERNS = [
  /(?:at|@)\s+([A-Z][A-Za-z0-9\s&'.\-]{2,28}?)(?:\s+on|\s+\d|[,.])/,
  /POS[:\s]+([A-Za-z0-9\s&'.\-]{2,28}?)(?:\s+on|\s+\d|[,.])/i,
  /transfer\s+(?:to|from)\s+([A-Za-z0-9\s]{2,28}?)(?:\s+on|\s+\d|[,.])/i,
];

const BALANCE_PATTERN = /(?:bal(?:ance)?|avail)[:\s]+(?:NGN|₦)?([\d,]+(?:\.\d{2})?)/i;

export function parseTransactionSMS(body: string): ParsedTransaction | null {
  for (const { regex, type, bank } of PATTERNS) {
    const match = body.match(regex);
    if (!match) continue;

    const amount = parseFloat(match[1].replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) continue;

    const merchantMatch = MERCHANT_PATTERNS.map(p => body.match(p)).find(Boolean);
    const balanceMatch = body.match(BALANCE_PATTERN);

    return {
      type,
      amount,
      bank,
      merchant: merchantMatch?.[1]?.trim(),
      balance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : undefined,
      date: new Date(),
      raw: body,
    };
  }
  return null;
}
