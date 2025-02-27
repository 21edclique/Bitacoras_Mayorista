import React from 'react';
import jsPDF from 'jspdf';
import EpemaBalck from '../images/ep-ema-black.png';

const PdfGenerator = {
  generatePDF: (selectedBitacora:any) => {
    if (!selectedBitacora) {
      console.error('No hay bitácora seleccionada.');
      return;
    }

    const pdf = new jsPDF();
    let y = 20.4; // Margen superior de Word en mm
    const marginLeft = 31.7; // Margen izquierdo de Word en mm
    const marginRight = 31.7; // Margen derecho de Word en mm
    const marginBottom = 20.4; // Margen inferior de Word en mm
    const maxWidth = 210 - marginLeft - marginRight; // Ajuste para el ancho del texto
    const pageHeight = 297 - 25.4 - marginBottom; // Ajuste para la altura
    const imageWidth = 20;
    const imageHeight = 20;
    const pageWidth = 210; // Ancho de página A4
    const textX = pageWidth / 2; // Centrar texto en la página
    const lineSpacing = 6; // Espaciado entre líneas

    const year = new Date(selectedBitacora.fecha).getFullYear(); // Obtiene el año actual
    const bitacoraId = selectedBitacora.id_bitacora; // Reemplaza con el ID dinámico de la bitácora
    y += 5;

    // Título principal
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text(`EP-EMA-OPERVIG-${year}-${bitacoraId}`, textX, y, { align: 'center' });
    y += 7;

    // Subtítulo
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Sistema de Monitoreo y Control', textX, y, { align: 'center' });
    y += 2;

    // Agregar el logo debajo del texto
    pdf.addImage(EpemaBalck, 'PNG', (pageWidth - imageWidth) / 2, y, imageWidth, imageHeight);
    y += imageHeight + 10;

    // Información de la bitácora
    pdf.setFont('helvetica', 'bold');
    pdf.text('Fecha:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(selectedBitacora.fecha.split('T')[0]), marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('De:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${selectedBitacora.nombre}`, marginLeft + 30, y);
    y += lineSpacing;

    // Si existe un compañero, escribir su nombre debajo
    if (selectedBitacora.nombre_colega) {
      pdf.text(`${selectedBitacora.nombre_colega}`, marginLeft + 30, y);
      y += lineSpacing;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.text('Para:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Ing. Jorge Chicaiza (Analista TIC)', marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Asunto:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Informe diario de Bitácora', marginLeft + 30, y);
    y += lineSpacing;

    // Línea divisoria
    // pdf.line(marginLeft, y, 150, y);
    y += lineSpacing;

    // Detalles de la novedad
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detalles de la Novedad:', marginLeft, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Hora:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${selectedBitacora.hora}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Nave:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${selectedBitacora.nombre}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Cámara:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${selectedBitacora.camara}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Turno:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${selectedBitacora.turno}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Referencia:', marginLeft, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'normal');
    const referenciaLines = pdf.splitTextToSize(selectedBitacora.referencia, maxWidth);
    referenciaLines.forEach((line:string) => {
      if (y + lineSpacing > pageHeight) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, marginLeft, y);
      y += lineSpacing;
    });

    // Línea divisoria
    // pdf.line(marginLeft, y, 195, y);
    y += lineSpacing;

    // Descripción
    pdf.setFont('helvetica', 'bold');
    pdf.text('Descripción:', marginLeft, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'normal');
    const textLines = pdf.splitTextToSize(selectedBitacora.novedad, maxWidth);
    for (let i = 0; i < textLines.length; i++) {
      if (y + lineSpacing > pageHeight) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(textLines[i], marginLeft, y);
      y += lineSpacing;
    }

    // Línea divisoria
    // pdf.line(marginLeft, y, 195, y);
    y += lineSpacing;

    // Resultado
    pdf.setFont('helvetica', 'bold');
    pdf.text('Resultado:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(selectedBitacora.resultado, marginLeft + 30, y);
    y += lineSpacing * 5;

    // Firmas
    if (selectedBitacora.nombre_colega) {
      if (y + 20 > pageHeight) {
        pdf.addPage();
        y = 20;
      }

      // Firma del usuario principal
      pdf.text('__________________________', 70, y, { align: 'center' });
      pdf.text(selectedBitacora.nombres, 70, y + 5, { align: 'center' });
      pdf.text('Operador Equipo de Monitoreo', 70, y + 10, { align: 'center' });

      // Firma del colega
      pdf.text('__________________________', 135, y, { align: 'center' });
      pdf.text(selectedBitacora.nombre_colega, 135, y + 5, { align: 'center' });
      pdf.text('Operador Equipo de Monitoreo', 135, y + 10, { align: 'center' });

      y += lineSpacing * 5;
    } else {
      if (y + 20 > pageHeight) {
        pdf.addPage();
        y = 20;
      }

      // Solo firma del usuario principal
      pdf.text('__________________________', 105, y, { align: 'center' });
      pdf.text(selectedBitacora.nombres, 105, y + 5, { align: 'center' });
      pdf.text('Operador Equipo de Monitoreo', 105, y + 10, { align: 'center' });
      y += lineSpacing * 5;
    }

     // Verificar si han pasado más de 2 minutos desde la creación de la bitácora
     const bitacoraDate = new Date(
      `${selectedBitacora.fecha.split('T')[0]}T${selectedBitacora.hora}`
    );
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - bitacoraDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 9) {
      // Agregar el pie de página con el texto adicional
      pdf.setFontSize(8);

      // Texto principal (EP-EMA-OPERVIG-${year}-${bitacoraId})
      pdf.text(`EP-EMA-OPERVIG-${year}-${bitacoraId}`, textX, pageHeight - 20, {
        align: 'center',
      });

      // Texto "Validado" debajo y centrado
      pdf.text('VALIDADO', textX, pageHeight - 15, { align: 'center' });
    }

    // Guardar el PDF
    pdf.save(`Bitacora_${selectedBitacora.id_bitacora}.pdf`);
  }
};

export default PdfGenerator;