import { Context } from "koa";
import { BookController } from "../../controllers/bookController";
import { BookService } from "../../services/bookService";

jest.mock("../../services/bookService");

describe("BookController", () => {
  let controller: BookController;
  let mockBookService: jest.Mocked<BookService>;
  let ctx: Partial<Context>;

  beforeEach(() => {
    mockBookService = new BookService(
      {} as any,
      {} as any,
      {} as any
    ) as jest.Mocked<BookService>;
    controller = new BookController(mockBookService);

    ctx = {
      query: {},
      params: {},
      request: { body: {} } as any,
      status: undefined,
      body: undefined,
    };

    jest.clearAllMocks();
  });

  it('should search books successfully', async () => {
    ctx.query = { title: 'Test Book' };
    const searchResult = [{ id: 1, title: 'Test Book', author_id: 1, author_name: 'Test Author' }];
    mockBookService.searchBooks.mockResolvedValue({
      success: true,
      books: searchResult as any
    });

    await controller.searchBooks(ctx as Context);

    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual({
      books: searchResult,
      count: 1
    });
  });

  it("should return validation error for search without parameters", async () => {
    ctx.query = {};

    await controller.searchBooks(ctx as Context);

    expect(ctx.status).toBe(400);
    expect(ctx.body).toHaveProperty("error");
  });

  it('should update book successfully', async () => {
    ctx.params = { id: '1' };
    ctx.request!.body = { title: 'Updated Title' };
    mockBookService.updateBook.mockResolvedValue({
      success: true,
      message: 'Book updated',
      book: { id: 1, title: 'Updated Title', author_id: 1 }
    });

    await controller.updateBook(ctx as Context);

    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual({
      message: 'Book updated',
      book: { id: 1, title: 'Updated Title', author_id: 1 }
    });
  });
});
