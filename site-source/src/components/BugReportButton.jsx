import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { createBugReport, probeBridge, queueBugReport, sendBugReport } from '../data/diagnostics';

export default function BugReportButton({ nick, lastError, build, loadedNick }) {
  const [sending, setSending] = React.useState(false);
  const [receipt, setReceipt] = React.useState('');
  const [sendError, setSendError] = React.useState('');

  async function submit() {
    setSending(true);
    setReceipt('');
    setSendError('');
    await probeBridge();
    const category = /Вещь|каталог|экипировк|руна/i.test(lastError) ? 'equipment' :
      lastError ? 'import' : 'other';
    const report = createBugReport({ nick, category, lastError, build, loadedNick });
    try {
      setReceipt(await sendBugReport(report));
    } catch (error) {
      const queued = queueBugReport(report);
      setSendError(queued
        ? 'Сервер пока недоступен. Отчёт ожидает отправки и уйдёт автоматически при восстановлении связи.'
        : `Не удалось сохранить отчёт (${error.message}). Повторите позже.`);
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
