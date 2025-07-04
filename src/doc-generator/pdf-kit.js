const PDFDocument = require('pdfkit');


const buildPdfFromUserRoutine = (dataCallback, endCallback, user_routine) => {
    const doc = new PDFDocument();

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    doc.fontSize(20).fillColor('blue').text(user_routine.nombre.toUpperCase(), { align: 'center', underline: true, bold: true });
    doc.fillColor('black').fontSize(12);
    doc.moveDown();
    
    doc.font('Helvetica-Bold').text('Fecha de inicio: ', { continued: true });
    doc.font('Helvetica').text(user_routine.fecha_inicio_rutina ? user_routine.fecha_inicio_rutina : 'No especificada');

    doc.font('Helvetica-Bold').text('Fecha de fin: ', { continued: true });
    doc.font('Helvetica').text(user_routine.fecha_fin_rutina ? user_routine.fecha_fin_rutina : 'No especificada');

    doc.font('Helvetica-Bold').text('Activa: ', { continued: true });
    doc.font('Helvetica').text(user_routine.activa ? 'Sí' : 'No');

    doc.font('Helvetica-Bold').text('Privacidad: ', { continued: true });
    doc.font('Helvetica').text(user_routine.rutina_compartida ? 'Pública' : 'Privada');

    doc.font('Helvetica-Bold').text('Observaciones: ', { continued: true });
    doc.font('Helvetica').text(user_routine.rutina_observaciones || 'No hay observaciones');

    doc.font('Helvetica-Bold').text('Dia: ', { continued: true });
    const diaSemana = {
        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado',
        7: 'Domingo'
    };
    doc.font('Helvetica').text(diaSemana[user_routine.dia] || 'No especificado');
    doc.moveDown();

    doc.font('Helvetica-Bold').fillColor('blue').text('Ejercicios:');
    doc.fillColor('black');
    if (user_routine.ejercicios && user_routine.ejercicios.length > 0) {
        user_routine.ejercicios.forEach((ejercicio, index) => {
            doc.moveDown();
            doc.font('Helvetica-Bold').text(`${index + 1}. ${ejercicio.nombre}`);
            doc.font('Helvetica').text(` - Grupo muscular: ${ejercicio.grupos_musculares}`);
            doc.font('Helvetica').text(` - Series: ${ejercicio.series}`);
            doc.font('Helvetica').text(` - Repeticiones: ${ejercicio.repeticiones}`);
            doc.font('Helvetica').text(` - Comentario: ${ejercicio.comentario || 'No hay comentario'}`);
            doc.font('Helvetica').text(` - Tipo: ${ejercicio.tipo}`);
            doc.font('Helvetica').text(' - Explicación:');
            if (ejercicio.step_1 && ejercicio.step_2) {
                doc.font('Helvetica').text(`   · Paso 1: ${ejercicio.step_1}`);
                doc.font('Helvetica').text(`   · Paso 2: ${ejercicio.step_2}`);
            } else {
                doc.font('Helvetica').text('   · No hay pasos definidos para este ejercicio.');
            }

        });
    } else {
        doc.moveDown().font('Helvetica').text('No hay ejercicios en esta rutina.');
    }

    doc.end();

}

module.exports = {
    buildPdfFromUserRoutine
};