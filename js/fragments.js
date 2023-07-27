/**
 * Load the contents of <path> into <elem>.
 * @param {String} path
 * @param {HTMLElement} elem
 */
export const loadFragment = async (path, elem) => {
  // Create a root <div> element to attach the fragment into.
  // const dom = elem.attachShadow({ mode: "open" });
  const dom = elem;
  const root = document.createElement("div");

  // Load the contents of the fragment and add them to the shadow DOM.
  const res = await fetch(`${path}?ts=${Date.now()}`);
  root.innerHTML = await res.text();
  dom.appendChild(root);

  // Replace the script nodes to trigger execution.
  Array.from(dom.querySelectorAll("script")).forEach((node) => {
    const script = document.createElement("script");
    Array.from(node.attributes).forEach((attr) =>
      script.setAttribute(attr.name, attr.value)
    );
    script.appendChild(document.createTextNode(node.innerHTML));
    node.parentElement.replaceChild(script, node);
  });
};

/**
 * Recursively load all fragments references found in <root>.
 * @param {HTMLElement} root
 */
export const loadAllFragments = async (root) => {
  const containers = Array.from(root.querySelectorAll("div[data-fragment]"));
  while (containers.length > 0) {
    await Promise.all(
      containers.map(async (elem) => {
        const path = elem.dataset.fragment;
        await loadFragment(path, elem);
        delete elem.dataset.fragment;
      })
    );
    containers.splice(
      0,
      containers.length,
      ...Array.from(root.querySelectorAll("div[data-fragment]"))
    );
  }
};
