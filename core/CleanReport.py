""" 
                    report_text = full_text.get_text()
                    report_text = report_text.replace("/", " / ")

                    # Workaround: BS lässt keinen Whitespace am Ende von Absätzen.
                    # Beginnt dann ein Absatz mit einem Namen, wird dieser nicht erkannt.
                    report_text = re.sub(r"\.([a-zA-Z])", ". \\1", report_text)

"""