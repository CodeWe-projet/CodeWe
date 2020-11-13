class Document:
    def __init__(self, document_dict):
        self.document_dict = document_dict
    
    def set_line(self, line_uuid, content):
        for elem in self.document_dict:
            print(elem)
            if elem['uuid'] == line_uuid:
                elem["content"] = content
                break

    def new_line(self, previous_uuid, line_uuid, content):
        index = self.document_dict.index(list(filter(lambda el: el['uuid'] == previous_uuid, self.document_dict))[0])
        self.document_dict.insert(index+1, {"uuid": line_uuid, "content": content})
    
    def delete_line(self, line_uuid):
        for elem in self.document_dict:
            if elem["uuid"] == line_uuid:
                self.document_dict.remove(elem)
                break


    def apply_requests(self, requests):
        for request in requests:
            type_request = request["type"]
            data = request["data"]
            if type_request == "set-line":
                self.set_line(data["id"], data["content"])
            elif type_request == "new-line":
                self.new_line(data["previous"], data["id"], data["content"])
            elif type_request == "delete-line":
                self.delete_line(data["id"])