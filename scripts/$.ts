import node_path from "node:path";
export const $ = Object.assign(
  async (command: string, options: Deno.CommandOptions | string[] | string) => {
    let safe_cmd = command;
    const safe_options: Deno.CommandOptions = {};
    if (Array.isArray(options)) {
      safe_options.args = options;
    } else if (typeof options === "string") {
      safe_options.args = options.trim().split(/\s+/);
    } else {
      Object.assign(safe_options, options);
    }
    console.info('%c⫸ %c'+[command, ...(safe_options.args ?? [])].join(' '),'color:magenta');
    if (Deno.build.os === "windows") {
      safe_cmd = "cmd";
      safe_options.args = ["/c", command, ...(safe_options.args ?? [])];
      if (safe_options.cwd == null) {
        safe_options.cwd = $.cwd;
      }
    }
    const task = new Deno.Command(safe_cmd, {
      cwd: $.cwd,
      ...safe_options
  });
    const status = await task.spawn().status;
    if (!status.success) {
      console.error(`exec ${command} fail with signal: ${status.signal}`);
      Deno.exit(status.code);
    }
  },
  {
    cwd: Deno.cwd(),
    cd: (path: string) => {
      $.cwd = node_path.resolve($.cwd, path);
      return $;
    },
  }
);