import { Injectable } from '@nestjs/common';

@Injectable()
export class ExternalIdComposer {
    public compose(id: string, clientId: string): string {
        return `${clientId}__${id}`;
    }

    public decompose(id: string, clientId: string): string {
        return id.substr(clientId.length + 2);
    }
}
