class FakeUci:
    def __init__(self, data={}):
        self.data = data
        self.tmp = {}

    def get(self, name):
        return self.data.get(name)

    def set(self, name, value):
        if value == None:
            raise ValueError("value can not be None.")
        self.tmp[name] = value

    def commit(self, section):
        match = lambda x: x[0].startswith(section + ".")
        tmp_section_items = [i for i in self.tmp.items() if match(i)]
        non_tmp_section_items = [i for i in self.tmp.items() if not match(i)]

        self.data = dict(self.data.items() + tmp_section_items)
        self.tmp = dict(non_tmp_section_items)
