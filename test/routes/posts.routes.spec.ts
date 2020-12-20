import { PostAttrs } from './../../src/models/post';
import 'reflect-metadata';
import { container } from 'tsyringe';
import supertest, { SuperAgentTest } from 'supertest';
import { Server } from '../../src/server';
import { expect } from 'chai';
import { IPostService } from '../../src/interfaces/post.service.interface';
import sinon from 'sinon';
import { PostService } from '../../src/services/post.service';

class PostServiceMock implements IPostService {
  getAll = () => Promise.resolve([]);
  getById = () => Promise.resolve(null as any);
  create = () => Promise.resolve(null as any);
  update = () => Promise.resolve(null as any);
  delete = () => Promise.resolve();
}

describe('/api/posts', () => {
  let request: SuperAgentTest;
  let app: Express.Application;
  let postServiceStub: IPostService;

  beforeEach(() => {
    container.register<IPostService>(PostService, {
      useValue: new PostServiceMock(),
    });
    postServiceStub = container.resolve(PostService);
    app = new Server().getApp();
    request = supertest.agent(app);
  });

  describe('GET /', () => {
    it('should respond 200', async () => {
      const res = await request.get('/api/posts');
      expect(res.status).to.equal(200);
    });
  });

  describe('GET /:id', () => {
    it('should respond 404', async () => {
      const service = container.resolve(PostService);
      sinon.stub(service, 'getById').returns(Promise.resolve(null as any));
      const res = await request.get('/api/posts/5fdfaf5be998b11d27b924af');
      expect(res.status).to.equal(404);
      expect((postServiceStub.getById as sinon.SinonSpy).calledOnce).to.be.true;
    });

    it('should respond 200', async () => {
      const post: PostAttrs = {
        content: 'Post content',
        title: 'Post Title',
        url: 'post-title',
      };
      const service = container.resolve(PostService);

      sinon.stub(service, 'getById').returns(Promise.resolve(post));
      const res = await request.get('/api/posts/5fdfaf5be998b11d27b924af');
      expect(res.status).to.equal(200);
      expect(res.body).to.eql(post);
      expect((postServiceStub.getById as sinon.SinonSpy).calledOnce).to.be.true;
    });
  });

  describe('POST /', () => {
    it('should respond 400 when there is a validation error', async () => {
      const res = await request.post('/api/posts').send({});
      expect(res.status).to.equal(400);
      expect(res.body).to.eql({
        errors: [
          { isDefined: 'title should not be null or undefined' },
          { isDefined: 'url should not be null or undefined' },
          { isDefined: 'content should not be null or undefined' },
        ],
      });
    });

    it('should respond 201 when the entity is created', async () => {
      const post: PostAttrs = {
        content: 'Post content',
        title: 'Post Title',
        url: 'post-title',
      };
      const id = '5fdfaf5be998b11d27b924af';
      const service = container.resolve(PostService);

      sinon.stub(service, 'create').returns(Promise.resolve({ ...post, id }));
      const res = await request.post('/api/posts').send(post);
      expect(res.status).to.equal(201);
      expect(res.body).to.eql({ ...post, id });
    });

    it('should handle database error', async () => {
      const post: PostAttrs = {
        content: 'Post content',
        title: 'Post Title',
        url: 'post-title',
      };
      const service = container.resolve(PostService);

      sinon
        .stub(service, 'create')
        .returns(Promise.reject(new Error('database error')));
      const res = await request.post('/api/posts').send(post);
      expect(res.status).to.equal(500);
    });
  });

  describe('PUT /:id', () => {
    it('should respond 400 when there is a validation error', async () => {
      const id = '5fdfaf5be998b11d27b924af';
      const res = await request.put(`/api/posts/${id}`).send({});
      expect(res.status).to.equal(400);
      expect(res.body).to.eql({
        errors: [
          { isDefined: 'title should not be null or undefined' },
          { isDefined: 'url should not be null or undefined' },
          { isDefined: 'content should not be null or undefined' },
        ],
      });
    });

    it('should respond 200 when the entity is updated', async () => {
      const post: PostAttrs = {
        content: 'Post content updated',
        title: 'Post Title',
        url: 'post-title',
      };
      const service = container.resolve(PostService);

      sinon.stub(service, 'update').returns(Promise.resolve(post));
      const id = '5fdfaf5be998b11d27b924af';
      const res = await request.put(`/api/posts/${id}`).send(post);
      expect(res.status).to.equal(200);
      expect(res.body).to.eql({ ...post });
    });

    it('should handle database error', async () => {
      const post: PostAttrs = {
        content: 'Post content',
        title: 'Post Title',
        url: 'post-title',
      };
      const service = container.resolve(PostService);

      sinon
        .stub(service, 'update')
        .returns(Promise.reject(new Error('database error')));
      const id = '5fdfaf5be998b11d27b924af';
      const res = await request.put(`/api/posts/${id}`).send(post);
      expect(res.status).to.equal(500);
    });
  });

  describe('DELETE /:id', () => {
    it('should respond 400 when there is a validation error', async () => {
      const id = '5fdfaf5be998b11d27b924af';
      const res = await request.del(`/api/posts/${id}`);
      expect(res.status).to.equal(204);
    });

    it('should handle database error', async () => {
      const service = container.resolve(PostService);

      sinon
        .stub(service, 'delete')
        .returns(Promise.reject(new Error('database error')));
      const id = '5fdfaf5be998b11d27b924af';
      const res = await request.del(`/api/posts/${id}`);
      expect(res.status).to.equal(500);
    });
  });
});
