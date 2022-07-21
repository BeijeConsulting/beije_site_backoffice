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

export function checkIsQuickSave(isQuickSave, targetName) {
  if (targetName === "quickSave") {
    isQuickSave = true;
  } else {
    isQuickSave = false;
  }
  return isQuickSave;
}

export function getResponse(apiCall) {
  return apiCall ?? { response: null }
}


