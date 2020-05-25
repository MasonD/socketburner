interface CustomWindow extends Window {
  quitSocketBurner: Function;
  io: any;
}
declare let parent: CustomWindow;
const // exposes document for free
  object_document = parent["document"],
  // takes a file, creates a blob, and returns a url
  string_get_url = (
    ns: {
      write?: (arg0: string, arg1: string, arg2: string) => void;
      tprint?: (arg0: string) => void;
      read?: (arg0: string) => string;
    },
    string_file: string,
    string_mime_type: string
  ) =>
    URL.createObjectURL(
      new Blob(
        [
          new TextEncoder().encode(
            ns.read !== undefined ? ns.read(string_file) : undefined
          ).buffer,
        ],
        {
          type: string_mime_type,
        }
      )
    ),
  // loads a script for use
  void_load_script = (string_url_script: string) =>
    new Promise((resolve) => {
      const script = object_document.createElement("script");
      (script.onload = resolve),
        (script.src = string_url_script),
        object_document.getElementsByTagName("head")[0].appendChild(script);
    }),
  // responds to keyboard events
  void_responder = (
    object_keyboard_event: KeyboardEvent,
    array_key_action: any[]
  ) => {
    if (
      object_keyboard_event.ctrlKey &&
      !object_keyboard_event.getModifierState(object_keyboard_event.key) &&
      object_keyboard_event.key.toLowerCase() === array_key_action[0]
    )
      switch (array_key_action.length) {
        case 2:
          array_key_action[1]();
          break;
        case 3:
          array_key_action[1](array_key_action[2]);
          break;
        default:
          throw new Error(
            `Invalid parameter passed:\n${JSON.stringify(array_key_action)}`
          );
      }
  };
export const main = async (ns: {
  write: (arg0: string, arg1: string, arg2: string) => void;
  tprint: (arg0: string) => void;
}) => {
  // start hotkey listener
  const void_listener = (object_keyboard_event: KeyboardEvent) => {
    try {
      void_responder(object_keyboard_event, ["/", parent.quitSocketBurner]);
    } catch (error) {
      console.log(error),
        object_document.removeEventListener("keydown", void_listener);
    }
  };
  // load socket.io
  parent.io ||
    (await void_load_script(
      string_get_url(ns, "socket.io.slim.js", "application/javascript")
    ));
  const socket = io("http://localhost:3000", { secure: !1 });
  socket.on(
    "message",
    ({
      name: name,
      contents: contents,
    }: {
      name: string;
      contents: string;
    }) => {
      ns.write(name, contents, "w");
    }
  ),
    object_document.addEventListener("keydown", void_listener),
    // don't stop unless the exit signal is received
    await new Promise((resolve) => {
      parent.quitSocketBurner = () => {
        ns.tprint("Exit signal received."), socket.close(), resolve();
      };
    });
};
