import * as moment from 'moment';

/**
 * get dates during week
 */
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

export function getTimeBetweenDates(dateLeft, dateRight) {
  // Definir las dos fechas
  const initDate = moment(dateLeft);
  const endDate = moment(dateRight);

  // Calcular la diferencia entre las dos fechas
  const diferencia = moment.duration(endDate.diff(initDate));

  // Obtener la cantidad de horas y minutos
  const hours = Math.floor(diferencia.asHours());
  const minutes = diferencia.minutes();
  // Imprimir la cantidad de horas y minutos
  return new timeRegister(hours, minutes);
}

export class timeRegister {
  constructor(
    public hours: number,
    public minutes: number,
  ) {}

  // Método para sumar otro tiempo
  add(time: timeRegister): timeRegister {
    let totalHoras = this.hours + time.hours;
    let totalMinutos = this.minutes + time.minutes;

    // Manejar el exceso de minutes
    if (totalMinutos >= 60) {
      totalHoras += Math.floor(totalMinutos / 60);
      totalMinutos %= 60;
    }

    return new timeRegister(totalHoras, totalMinutos);
  }

  // Método para formatear el time como una cadena HH:mm
  formatear(): string {
    return `${this.hours.toString().padStart(2, '0')}:${this.minutes
      .toString()
      .padStart(2, '0')}`;
  }
}
