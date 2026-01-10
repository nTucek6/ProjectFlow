import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ProjectDto } from '@shared/dto/project.dto';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class GeneratePDFService {
  private formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat(undefined, {
      // undefined = browser locale (hr-HR/CET)
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      ...options,
    }).format(d);
  }

  generateProjectPdf(project: ProjectDto) {
    const doc = new jsPDF();

    const projectName = project.name;
    const createdAt = this.formatDate(project.createdAt);
    let startDate: any = project.startDate != null ? this.formatDate(project.startDate) : 'None';
    const deadline = this.formatDate(project.deadline);
    const progress = project.progress;
    const totalTasks = project.totalTasks;
    const membersCount = project.membersCount;

    //     `kanban`;

    let y = 20;

    // Bold title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Project: ${projectName}`, 15, y);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Created at: ${createdAt}`, 20, y);
    y += 10;
    doc.text(`Start date: ${startDate}`, 20, y);
    y += 10;
    doc.text(`Deadline: ${deadline}`, 20, y);
    y += 10;
    doc.text(`Progress: ${progress}%`, 20, y);
    y += 10;
    doc.text(`Total tasks: ${totalTasks}`, 20, y);
    y += 10;
    doc.text(`Total members: ${membersCount}`, 20, y);

    doc.save(projectName + 'Info.pdf');
  }
}
