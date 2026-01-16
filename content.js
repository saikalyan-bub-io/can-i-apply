function getJD() {

  // LinkedIn job title selectors (updated for current LinkedIn structure)
  const titleSelectors = [
    ".job-details-jobs-unified-top-card__job-title h1",
    ".jobs-unified-top-card__job-title",
    ".job-details-jobs-unified-top-card__job-title",
    ".jobs-details-top-card__job-title h1",
    "h1.t-24",
    "h1",
    ".job-title",
    "[data-job-title]"
  ];

  let title = "";
  for (const s of titleSelectors) {
    const el = document.querySelector(s);
    if (el && el.innerText && el.innerText.trim()) {
      title = el.innerText.trim();
      break;
    }
  }
  // LinkedIn job description selectors (updated for current LinkedIn structure)
  const bodySelectors = [
    ".jobs-description-content__text",
    ".jobs-description__content",
    ".show-more-less-html__markup",
    ".jobs-box__html-content",
    ".description__text",
    "article.jobs-description",
    "article"
  ];

  let description = "";
  for (const s of bodySelectors) {
    const el = document.querySelector(s);
    if (el && el.innerText && el.innerText.length > 200) {
      description = el.innerText.trim();
      break;
    }
  }

  // Fallback: try to get any visible text from the page
  if (!description || description.length < 200) {
    description = document.body.innerText.slice(0, 8000);
  }

  const result = `Job Title: ${title}\n\nJob Description:\n${description}`;

  return result;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === "GET_JD") {
    // Check if user is on a search results page
    const url = window.location.href;
    const isSearchPage = (url.includes("search-results") || (url.includes("/jobs/search/") && !url.includes("/view/"))) && !url.includes("currentJobId=");

    if (isSearchPage) {
      sendResponse({ jd: "", error: "SEARCH_PAGE" });
      return true;
    }

    try {
      const jd = getJD();
      sendResponse({ jd: jd });
    } catch (error) {
      sendResponse({ jd: "" });
    }
  }
  return true; // Keep the message channel open for async response
});