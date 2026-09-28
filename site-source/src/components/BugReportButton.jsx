import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { createBugReport, pendingReportIdFor, probeBridge, queueBugReport, sendBugReport } from '../data/diagnostics';

export default function BugReportButton({ nick, lastError, build, loadedNick, resetKey }) {
  const [sending, setSending] = React.useState(false);
  const [receipt, setReceipt] = React.useState('');
  const [sendError, setSendError] = React.useState('');
  const [pendingId, setPendingId] = React.useState(() => pendingReportIdFor(nick));
  React.useEffect(() => {
    const id = pendingReportIdFor(nick);
    setPendingId(id);
    setReceipt('');
    setSendError(id ? `Отчёт №${id} ожидает отправки. Повторим автоматически при восстановлении связи.` : '');
  }, [nick, resetKey]);

  React.useEffect(() => {
    const delivered = event => {
      if (event.detail?.id !== pendingId) return;
      setReceipt(event.detail.id);
      setPendingId('');
      setSendError('');
    };
    window.addEventListener('chaosinventory:report-delivered', delivered);
    return () => window.removeEventListener('chaosinventory:report-delivered', delivered);
  }, [pendingId]);

  async function submit() {
    setSending(true);
    setReceipt('');
    setSendError('');
    let report;
    try {
      await probeBridge();
      const category = /Вещь|каталог|экипировк|руна/i.test(lastError) ? 'equipment' :
        lastError ? 'import' : 'other';
      report = createBugReport({ nick, category, lastError, build, loadedNick });
      setReceipt(await sendBugReport(report));
    } catch (error) {
      const queued = report && queueBugReport(report);
      if (queued) setPendingId(report.clientId);
      const reason = error.name === 'AbortError' ? 'тайм-аут' : String(error.message || error.name).slice(0, 100);
      setSendError(queued
        ? `Отчёт №${report.clientId} ожидает отправки (${reason}). Повторим автоматически при восстановлении связи.`
        : `Не удалось сохранить отчёт (${reason}). Повторите позже.`);
    } finally {
      setSending(false);
    }
  }

  return <span style={{ display: 'inline-block', margin: '6px 0' }}>
    <Button variant="outlined" color="primary" onClick={submit} disabled={sending}
      title="Отправить ник, текущий билд, этапы загрузки и сведения о браузере для анализа ошибки">
      {sending ? 'Отправляем отчёт…' : 'Сообщить об ошибке'}
    </Button>
    {receipt && <Typography role="status" style={{ color: '#226044' }}>Отчёт сохранён. Номер: {receipt}</Typography>}
    {sendError && <Typography role="alert" color="error">{sendError}</Typography>}
  </span>;
}
