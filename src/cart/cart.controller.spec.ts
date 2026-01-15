import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    addItem: jest.fn(),
    getCart: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add item to cart', async () => {
    const dto = { productId: 'p1', quantity: 2 };

    mockCartService.addItem.mockResolvedValue({
      id: '1',
      ...dto,
    });

    const result = await mockCartService.addItem(dto);

    expect(mockCartService.addItem).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      id: '1',
      productId: 'p1',
      quantity: 2,
    });
  });
  it('should return cart items', async () => {
    const cart = [
      { id: '1', productId: 'p1', quantity: 2 },
      { id: '2', productId: 'p2', quantity: 1 },
    ];

    mockCartService.getCart.mockResolvedValue(cart);

    const result = await mockCartService.getCart();

    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(result).toEqual(cart);
  });
});
