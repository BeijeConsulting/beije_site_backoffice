export function permalink(string) {
  return string.replace(" ", "-").replace("_", "-")
}

export const navigateWithNotify = (navigate, path) => {
  navigate(path, {
    state: {
      toast: true
    }
  });
}