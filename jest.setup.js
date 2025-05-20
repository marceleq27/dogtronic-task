import "@testing-library/jest-dom";

jest.mock("next/image", () => ({
  __esModule: true,
  // @ts-ignore
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="test" {...props} />;
  },
}));

// @ts-ignore
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
