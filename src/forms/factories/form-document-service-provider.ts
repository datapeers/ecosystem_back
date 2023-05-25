import { ModuleRef } from "@nestjs/core";
import { InternalServerErrorException } from "@nestjs/common";

import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';
import { StartupModule } from 'src/startup/startup.module';
import { InvestorModule } from "src/investor/investor.module";
import { ExpertModule } from "src/expert/expert.module";

import { EntrepreneurService } from "src/entrepreneur/entrepreneur.service";
import { StartupService } from "src/startup/startup.service";
import { InvestorService } from "src/investor/investor.service";
import { ExpertService } from "src/expert/expert.service";
import { FormDocumentService } from "./form-document-service";
import { FormCollections } from "../form/enums/form-collections";
import { ApplicantService } from "src/applicant/applicant.service";
import { ApplicantModule } from "src/applicant/applicant.module";

export const FORM_DOCUMENT_SERVICE_PROVIDER = "FORM_DOCUMENT_SERVICE_PROVIDER";
export type FormDocumentServiceProvider = (target: FormCollections) => FormDocumentService;

export const formDocumentServiceImports = [
  EntrepreneurModule,
  StartupModule,
  InvestorModule,
  ExpertModule,
  ApplicantModule,
];

export const formDocumentServiceProviders = [
  {
    inject: [ModuleRef],
    provide: FORM_DOCUMENT_SERVICE_PROVIDER,
      useFactory: (moduleRef: ModuleRef) => {
      return (target: FormCollections): FormDocumentService => {
        try {
          return moduleRef.get(target);
        } catch(ex) {
          throw new InternalServerErrorException("Couldn't find a handler for the requested form target");
        }
      }
    }
  },
  { provide: FormCollections.entrepreneurs, useExisting: EntrepreneurService },
  { provide: FormCollections.startups, useExisting: StartupService },
  { provide: FormCollections.investors, useExisting: InvestorService },
  { provide: FormCollections.experts, useExisting: ExpertService },
  { provide: FormCollections.announcements, useExisting: ApplicantService },
];
