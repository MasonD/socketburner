const
  // exposes document for free
  object_document = parent["document"],
  // takes a file, creates a blob, and returns a url
  string_get_url = (ns, string_file, string_mime_type) =>
    URL.createObjectURL(
      new Blob([new TextEncoder().encode(ns.read(string_file)).buffer], {
        type: string_mime_type,
      })
    ),
  // loads a script for use
  void_load_script = (string_url_script) =>
    new Promise((resolve) => {
      const script = object_document.createElement("script");
      (script.onload = resolve),
      (script.src = string_url_script),
      object_document.getElementsByTagName("head")[0].appendChild(script);
    }),
  // responds to keyboard events
  void_responder = async (object_keyboard_event) => {
    if (
      object_keyboard_event.ctrlKey &&
      !object_keyboard_event.getModifierState(object_keyboard_event.key)
    ) {
      const string_input = object_document.getElementById(
        "terminal-input-text-box"
      );
      switch (object_keyboard_event.key.toLowerCase()) {
        case "/":
          parent.quitSocketBurner();
      }
      string_input.value = "";
    }
  };
export const main = async (ns) => {
  // start hotkey listener
  const void_listener = async (object_keyboard_event) => {
    try {
      await void_responder(object_keyboard_event), ns.getScriptName();
    } catch (error) {
      console.log(error),
        object_document.removeEventListener("keydown", await void_listener);
    }
  };
  // load socket.io
  parent.io ||
    (await void_load_script(
      string_get_url(ns, "socket.io.slim.js", "application/javascript")
    ));
  try {
    const socket = io("http://localhost:3000", { secure: !1 });
    socket.on("message", ({ name: name, contents: contents }) => {
      ns.write(name, contents, "w");
    }),
    object_document.addEventListener("keydown", await void_listener),
    // don't stop unless the exit signal is received
    await new Promise((resolve) => {
      parent.quitSocketBurner = () => {
        ns.tprint("Exit signal received."), socket.close(), resolve();
      };
    });
  } catch (error) {
    throw new Error(error);
  }
};
