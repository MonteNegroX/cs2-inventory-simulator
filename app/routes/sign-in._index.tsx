/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { middleware } from "~/http.server";
import type { Route } from "./+types/sign-in._index";

export async function loader({ request }: Route.LoaderArgs) {
  await middleware(request);
  return authenticator.authenticate("steam", request);
}
