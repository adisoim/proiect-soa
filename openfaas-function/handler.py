import json
import sys

def handle(req):
    try:
        data = json.loads(req)

        task_id = data.get("id", "?")
        user_name = data.get("username", "User")
        title = data.get("title", "No title")
        description = data.get("description", "No description")
        status = data.get("status", "PENDING")

        if status == "DONE":
            email_subject = "congrats! task done"
            header_color = "green"
            message_body = f"congrats! task - <b>#{task_id}</b> is done."
        else:
            email_subject = "new task created"
            header_color = "blue"
            message_body = f"task - <b>#{task_id}</b> has been created."

        html_content = f"""
        <html>
            <body>
                <h1>Hello, {user_name}!</h1>
                <p>{message_body}</p>

                <div style="border: 2px solid {header_color}; padding: 15px; border-radius: 5px;">
                    <h3 style="color: {header_color};">{title}</h3>
                    <p><i>{description}</i></p>
                    <p>Current status: <b>{status}</b></p>
                </div>

                <p>Have a great day!</p>
            </body>
        </html>
        """

        return html_content

    except Exception as e:
        return f"Error parsing JSON: {str(e)}"