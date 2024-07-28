"use client";

import { io } from "socket.io-client";

/**
 * This function init a new web socket client instance
 */
export const socket = io();
