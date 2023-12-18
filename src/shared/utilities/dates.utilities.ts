export function infoWeekDates() {
  var fechaActual = new Date();

  // Obtiene el día de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
  var diaSemana = fechaActual.getDay();

  // Calcula la fecha del inicio de la semana (domingo) restando el número de días transcurridos desde el domingo
  var inicioSemana = new Date(fechaActual);
  inicioSemana.setDate(fechaActual.getDate() - diaSemana);

  // Calcula las fechas de los otros días de la semana
  var fechasSemana = [];
  for (var i = 0; i < 7; i++) {
    var fecha = new Date(inicioSemana);
    fecha.setDate(inicioSemana.getDate() + i);
    fechasSemana.push(fecha.toISOString().split('T')[0]); // Formato YYYY-MM-DD
  }

  // Devuelve un objeto con la información
  return {
    diaActual: diaSemana,
    fechaActual: fechaActual.toISOString().split('T')[0],
    fechasSemana: fechasSemana,
  };
}
