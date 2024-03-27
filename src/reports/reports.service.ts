import { Injectable } from '@nestjs/common';
import { CreateReportInput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Report } from './entities/report.entity';
import { Connection, Model } from 'mongoose';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createReportInput: CreateReportInput) {
    const createdPhase = await this.reportModel.create({
      ...createReportInput,
    });
    return createdPhase;
  }

  findAll() {
    return this.reportModel.find({});
  }

  async findOne(id: string) {
    const report = await this.reportModel.findById(id);
    if (report.query) await this.executeQuery(report);
    return report;
  }

  private async executeQuery(report: Report): Promise<any> {
    try {
      if (!report.query.inCollection || !report.query.code) return;
      // Ejecutar la consulta directamente utilizando el modelo de Mongoose
      // Aquí asumimos que la consulta es una actualización o inserción en otra colección
      const outCollection = report.query.code.find((i) => i.$out);
      if (!outCollection) return;
      await this.connection.collection(outCollection['$out']).deleteMany();
      const action = await this.connection
        .collection(report.query.inCollection)
        .aggregate(report.query.code)
        .toArray();
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      throw new Error('Error al ejecutar la consulta');
    }
  }
}
