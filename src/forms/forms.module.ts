import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './form/entities/form.entity';
import { FormsResolver } from './form/forms.resolver';
import { FormTagResolver } from './form-tag/form-tag.resolver';
import { FormsService } from './form/forms.service';
import { FormTagService } from './form-tag/form-tag.service';
import { FormTag, FormTagSchema } from './form-tag/entities/form-tag.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Form.name, schema: FormSchema },
      { name: FormTag.name, schema: FormTagSchema },
    ]),
    UsersModule,
  ],
  providers: [
    FormsResolver,
    FormTagResolver,
    FormsService,
    FormTagService
  ]
})
export class FormsModule {}
