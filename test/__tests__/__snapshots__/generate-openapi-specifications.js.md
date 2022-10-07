# Snapshot report for `__tests__/generate-openapi-specifications.js`

The actual snapshot is saved in `generate-openapi-specifications.js.snap`.

Generated by [AVA](https://avajs.dev).

## whatever

> Snapshot 1

    `openapi: 3.1.0␊
    info:␊
      title: todo␊
      summary: Service in charge of managing todo notes␊
      description: |2-␊
    ␊
            This service records todo notes, the following api calls are available:␊
    ␊
            * adding a todo notes␊
            * listing/finding todo notes␊
            * getting the details of a todo note␊
            ␊
      version: MISSING VERSION␊
    paths:␊
      /todo/{id}:␊
        get:␊
          summary: Get the content of a todo note␊
          description: |2-␊
    ␊
                    Returns the content of a particular todo notes as a string.␊
                    ␊
          operationId: todo.get␊
      /todo:␊
        post:␊
          summary: Adds a todo note␊
          description: |2-␊
    ␊
                    Will add a todo note through providing its content.␊
                    ␊
          operationId: todo.add␊
        get:␊
          summary: Find todo notes␊
          description: |2-␊
    ␊
                    Lists todo notes matching a query string passed as the only argument.␊
                    ␊
          operationId: todo.find␊
    `