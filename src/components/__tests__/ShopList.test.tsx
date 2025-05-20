import { render, screen } from "@testing-library/react";
import { ShopList } from "../ShopList";
import { api } from "@/trpc/react";
import { type Shop } from "@prisma/client";

jest.mock("@/trpc/react", () => ({
  api: { shops: { getShops: { useQuery: jest.fn() } } },
}));

const mockShops: Shop[] = [
  {
    id: "1",
    address: "123 Test Street, Test City",
    type: "FRANCHISE",
    imageUrl: "/test-image-1.jpg",
  },
  {
    id: "2",
    address: "456 Test Avenue, Test City",
    type: "REGULAR",
    imageUrl: "/test-image-2.jpg",
  },
];

const apiMock = api.shops.getShops.useQuery as jest.Mock;

describe("ShopList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading skeleton when data is loading", () => {
    apiMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<ShopList />);
    const skeletonItems = screen.getAllByTestId("shop-list-skeleton");
    expect(skeletonItems).toHaveLength(3);
  });

  it("shows error message when there is an error", () => {
    apiMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Test error"),
    });

    render(<ShopList />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("shows 'No shops found' message when there are no shops", () => {
    apiMock.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<ShopList />);
    expect(screen.getByText(/No shops found/i)).toBeInTheDocument();
  });

  it("renders list of shops when data is available", () => {
    apiMock.mockReturnValue({
      data: mockShops,
      isLoading: false,
      error: null,
    });

    render(<ShopList />);

    const cityElements = screen.getAllByText("Test City");
    expect(cityElements).toHaveLength(2);

    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText("456 Test Avenue")).toBeInTheDocument();
    expect(screen.getByText("FRANCHISE")).toBeInTheDocument();
    expect(screen.getByText("REGULAR")).toBeInTheDocument();
  });

  it("renders correct number of initial items", () => {
    const manyShops = Array.from({ length: 10 }, (_, i) => ({
      ...mockShops[0],
      id: String(i + 1),
    }));

    apiMock.mockReturnValue({
      data: manyShops,
      isLoading: false,
      error: null,
    });

    render(<ShopList />);

    // Should initially show 5 items (ITEMS_PER_PAGE)
    const shopItems = screen.getAllByRole("img");
    expect(shopItems).toHaveLength(5);
  });
});
