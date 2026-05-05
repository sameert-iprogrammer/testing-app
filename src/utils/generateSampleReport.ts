import type { WorkBook, WorkSheet } from 'xlsx';

const SAMPLE_DATA: (string | number)[][] = [
  ['Metric', 'Value', 'Change'],
  ['Total Revenue', 45231.89, '+20.1%'],
  ['Active Users', 2350, '+180.1%'],
  ['Page Views', 12234, '-4.5%'],
  ['Active Sessions', 573, '+12.5%'],
];

export async function generateSampleReport(): Promise<void> {
  try {
    const XLSX = await import('xlsx');

    if (!XLSX.utils) {
      throw new Error('Failed to load xlsx library: utils is undefined');
    }

    const workbook: WorkBook = XLSX.utils.book_new();
    const worksheet: WorkSheet = XLSX.utils.aoa_to_sheet(SAMPLE_DATA);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics Report');

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nexus-analytics-sample-report.xlsx';

    if (!document.body) {
      throw new Error('document.body is not available');
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate sample report: ${error.message}`, { cause: error });
    }
    throw new Error('Failed to generate sample report: unknown error', { cause: error });
  }
}
