import { HttpService } from '@nestjs/axios';
import { State } from './entities/state.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IbgeService {
  constructor(private readonly httpService: HttpService) {}

  async getIbgeState(state: string): Promise<State> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<State[]>(
          'http://servicodados.ibge.gov.br/api/v1/localidades/estados',
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    const stateFind = data.find(
      (item) => item.nome.toLowerCase() === state.toLowerCase(),
    );

    return stateFind;
  }

  async getIbgeStateByUF(uf: string): Promise<State> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<State>(
          `http://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }
}
