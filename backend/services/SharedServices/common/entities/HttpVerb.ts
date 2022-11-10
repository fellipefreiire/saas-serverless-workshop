import { IHttpVerb } from "./IHttpVerb"

export class HttpVerb implements IHttpVerb {
  public GET: string
  public POST: string
  public PUT: string
  public PATCH: string
  public HEAD: string
  public DELETE: string
  public OPTIONS: string
  public ALL: string

  constructor(
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    HEAD = "HEAD",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    ALL = "*"
  ) {
    this.GET = GET;
    this.POST = POST;
    this.PUT = PUT;
    this.PATCH = PATCH;
    this.HEAD = HEAD;
    this.DELETE = DELETE;
    this.OPTIONS = OPTIONS;
    this.ALL = ALL;
  }
}