#!/usr/bin/env python3

class AbstractExtractor:

    def __init__(self, destination, globals_):
        self.destination = destination
        self.globals_ = globals_

    def extract_information_thread(self, q, thread_id):

        while not q.empty():
            file_ = q.get()
            success=True
            try:
                self.extract_information(file_)

            except FileNotFoundError as error:
                print('File not found-Error:' + str(no), file=sys.stderr)
                success=False
                continue

            except NoHTML as error:
                self.globals_.file_done(file_, False)
                success = False
                continue

            except IOError as error:
                print('File-Error:' + str(no), file=sys.stderr)
                success = False
                continue

            self.globals_.file_done(file_, success)
