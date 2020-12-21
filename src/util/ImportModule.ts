import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

export type ImportModule = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;
