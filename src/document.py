class Document:
    def __init__(self, document_dict):
        """
        Args:
            document_dict (dictionary): Representation in dictionary of the document
        """
        self.document_dict = document_dict
    
    def set_line(self, line_uuid, content):
        """Update a line in the document

        Args:
            line_uuid (str): line id
            content (str): new content
        """
        for elem in self.document_dict:
            if elem['uuid'] == line_uuid:
                elem["content"] = content
                break

    def new_line(self, previous_uuid, line_uuid, content):
        """Add a new line to the document

        Args:
            previous_uuid (str): id of the line before
            line_uuid (str): the new line id
            content (str): content of the new line
        """
        index = self.document_dict.index(list(filter(lambda el: el['uuid'] == previous_uuid, self.document_dict))[0])
        self.document_dict.insert(index+1, {"uuid": line_uuid, "content": content})
    
    def delete_line(self, line_uuid):
        """Delete a line in the document

        Args:
            line_uuid (str): id of the line to delete
        """
        for elem in self.document_dict:
            if elem["uuid"] == line_uuid:
                self.document_dict.remove(elem)
                break


    def apply_requests(self, requests):
        """Apply a lists of requests to document

        Args:
            requests (list): list of request
        """
        for request in requests:
            type_request = request["type"]
            data = request["data"]
            if type_request == "set-line":
                self.set_line(data["id"], data["content"])
            elif type_request == "new-line":
                self.new_line(data["previous"], data["id"], data["content"])
            elif type_request == "delete-line":
                self.delete_line(data["id"])