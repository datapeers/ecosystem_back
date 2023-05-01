import { ModuleRef } from "@nestjs/core";
import { InternalServerErrorException } from "@nestjs/common";

import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';
import { StartupModule } from 'src/startup/startup.module';

import { EntrepreneurService } from "src/entrepreneur/entrepreneur.service";
import { StartupService } from "src/startup/startup.service";

import { FormDocumentService } from "./form-document-service";
import { FormCollections } from "../form/enums/form-collections";
import { InvestorModule } from "src/investor/investor.module";
import { InvestorService } from "src/investor/investor.service";

export const FORM_DOCUMENT_SERVICE_PROVIDER = "FORM_DOCUMENT_SERVICE_PROVIDER";
export type FormDocumentServiceProvider = (target: FormCollections) => FormDocumentService;

export const formDocumentServiceImports = [
  EntrepreneurModule,
  StartupModule,
  InvestorModule,
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
];
