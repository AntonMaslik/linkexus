import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let savedResult: any = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .send({ url: 'https://google.com' })
      .expect(201);

    if (typeof response.text === 'string') {
      savedResult = response.text.split('/').pop();
    } else {
      console.error('not save result');
    }

    console.log('TEST 1', savedResult);
  });

  it(`it shoud redirect to original url (GET)`, async () => {
    console.log('TEST 2', savedResult);
    await request(app.getHttpServer())
      .get(`/${savedResult}`)
      .expect(302)
      .expect('Location', 'https://google.com');
  });
});
