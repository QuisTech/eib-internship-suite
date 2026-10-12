import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_completion_letter(output_path, assets_dir):
    doc = docx.Document()
    
    # Page setup: A4, 0.75 in margins
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.6)
        section.bottom_margin = Inches(0.6)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
    
    # Letterhead Table (2 columns: Logo on left, Corporate details on right)
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    # Widths
    table.columns[0].width = Inches(3.2)
    table.columns[1].width = Inches(3.47)
    
    # Left cell: Logo
    cell_left = table.cell(0, 0)
    p_logo = cell_left.paragraphs[0]
    p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT
    logo_path = os.path.join(assets_dir, 'logo.png')
    if os.path.exists(logo_path):
        run_logo = p_logo.add_run()
        run_logo.add_picture(logo_path, width=Inches(2.2))
    
    # Right cell: Company info
    cell_right = table.cell(0, 1)
    p_info = cell_right.paragraphs[0]
    p_info.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    
    r_name = p_info.add_run("EIB STRATOC LIMITED\n")
    r_name.bold = True
    r_name.font.size = Pt(12)
    r_name.font.color.rgb = RGBColor(27, 77, 137)
    
    r_sub = p_info.add_run("Member of EIB Group • RC: 1849204\n")
    r_sub.font.size = Pt(8.5)
    r_sub.font.color.rgb = RGBColor(100, 110, 125)
    
    r_addr = p_info.add_run("Plot 12, Commercial Block, Victoria Island, Lagos, Nigeria\n"
                           "Tel: +234 (0) 803 000 0000 | +234 (0) 1 290 0000\n"
                           "Email: hr@eibstratoc.com | info@eibgroup.ng\n"
                           "Website: www.eibstratoc.com")
    r_addr.font.size = Pt(8)
    r_addr.font.color.rgb = RGBColor(110, 120, 135)
    
    # Decorative rule line under letterhead
    p_rule = doc.add_paragraph()
    p_rule.paragraph_format.space_before = Pt(4)
    p_rule.paragraph_format.space_after = Pt(14)
    r_rule = p_rule.add_run("━" * 58)
    r_rule.font.size = Pt(10)
    r_rule.font.color.rgb = RGBColor(27, 77, 137)
    
    # Date & Ref
    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.space_after = Pt(12)
    r_ref = p_meta.add_run("REF: EIB/HR/SIWES/2026/042\t\t\t\t\t")
    r_ref.bold = True
    r_ref.font.size = Pt(9.5)
    r_ref.font.color.rgb = RGBColor(60, 70, 85)
    
    r_date = p_meta.add_run("Date: 12th October, 2026")
    r_date.bold = True
    r_date.font.size = Pt(9.5)
    r_date.font.color.rgb = RGBColor(60, 70, 85)
    
    # Addressee
    p_addr = doc.add_paragraph()
    p_addr.paragraph_format.space_after = Pt(12)
    p_addr.paragraph_format.line_spacing = 1.15
    r_to = p_addr.add_run("The Coordinator,\n"
                          "Students Industrial Work Experience Scheme (SIWES) Unit,\n"
                          "Directorate of Academic Planning & Industrial Training,\n"
                          "[Name of Tertiary Institution / University / Polytechnic],\n"
                          "[City, State, Nigeria].")
    r_to.font.size = Pt(10)
    r_to.font.color.rgb = RGBColor(30, 40, 55)
    
    # Salutation
    p_sal = doc.add_paragraph()
    p_sal.paragraph_format.space_after = Pt(8)
    r_sal = p_sal.add_run("Dear Sir/Madam,")
    r_sal.font.size = Pt(10)
    r_sal.bold = True
    
    # Title / Subject
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(12)
    r_title = p_title.add_run("LETTER OF COMPLETION OF INDUSTRIAL TRAINING ATTACHMENT\n"
                             "RE: [STUDENT'S FULL NAME] | MATRIC NO: [MATRICULATION NUMBER]")
    r_title.bold = True
    r_title.font.size = Pt(11)
    r_title.font.color.rgb = RGBColor(27, 77, 137)
    
    # Paragraph 1: Certification
    p1 = doc.add_paragraph()
    p1.paragraph_format.space_after = Pt(8)
    p1.paragraph_format.line_spacing = 1.15
    p1.add_run(
        "This is to formally certify that "
    )
    r_sname = p1.add_run("[STUDENT'S FULL NAME]")
    r_sname.bold = True
    p1.add_run(
        ", a student of the Department of "
    )
    r_dept = p1.add_run("[Department / Discipline, e.g. Computer Science / Electrical Engineering]")
    r_dept.bold = True
    p1.add_run(
        ", with Matriculation Number "
    )
    r_mat = p1.add_run("[MATRICULATION NUMBER]")
    r_mat.bold = True
    p1.add_run(
        ", has successfully completed his mandatory "
    )
    r_dur = p1.add_run("six (6) months")
    r_dur.bold = True
    p1.add_run(
        " Students Industrial Work Experience Scheme (SIWES) attachment with "
    )
    r_cname = p1.add_run("EIB STRATOC LIMITED")
    r_cname.bold = True
    p1.add_run(
        ", commencing from "
    )
    r_sd = p1.add_run("14th April, 2026")
    r_sd.bold = True
    p1.add_run(" to ")
    r_ed = p1.add_run("9th October, 2026")
    r_ed.bold = True
    p1.add_run(".")
    
    # Paragraph 2: Roles and responsibilities
    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(8)
    p2.paragraph_format.line_spacing = 1.15
    p2.add_run(
        "During his period of attachment, he was assigned to our "
    )
    r_unit = p2.add_run("Operations & Technical Services Division")
    r_unit.bold = True
    p2.add_run(
        ", where he was exposed to real-world corporate workflows, project execution, quality assurance, system diagnostics, and collaborative technical problem-solving. He demonstrated a keen eagerness to learn, readily grasped complex operational methodologies, and contributed productively to departmental goals."
    )
    
    # Paragraph 3: Character & Appraisal
    p3 = doc.add_paragraph()
    p3.paragraph_format.space_after = Pt(8)
    p3.paragraph_format.line_spacing = 1.15
    p3.add_run(
        "Throughout the training duration, [Student Name] maintained an exemplary standard of discipline, punctuality, integrity, and professional decorum. He consistently demonstrated high moral character, diligence, team spirit, and strict compliance with our corporate health, safety, and operational regulations."
    )
    
    # Paragraph 4: Clearance
    p4 = doc.add_paragraph()
    p4.paragraph_format.space_after = Pt(16)
    p4.paragraph_format.line_spacing = 1.15
    p4.add_run(
        "He has surrendered all company properties in his possession and is hereby fully cleared of all organizational obligations. We commend his outstanding conduct and strongly recommend him for academic grading, certification, and future career engagements. We wish him continued success in his academic pursuits."
    )
    
    # Sign-off & Stamp Table
    p_close = doc.add_paragraph()
    p_close.paragraph_format.space_after = Pt(4)
    r_close = p_close.add_run("Yours faithfully,\nFor: ")
    r_close.font.size = Pt(10)
    r_cbold = p_close.add_run("EIB STRATOC LIMITED")
    r_cbold.bold = True
    r_cbold.font.size = Pt(10)
    
    # Table for Signature on Left, Stamp on Right
    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    sig_table.columns[0].width = Inches(3.2)
    sig_table.columns[1].width = Inches(3.47)
    
    # Signature side
    sig_cell = sig_table.cell(0, 0)
    p_sig = sig_cell.paragraphs[0]
    p_sig.paragraph_format.space_after = Pt(2)
    sig_img_path = os.path.join(assets_dir, 'marquis_signature.png')
    if os.path.exists(sig_img_path):
        r_sig_img = p_sig.add_run()
        r_sig_img.add_picture(sig_img_path, width=Inches(1.8))
    
    p_sig_text = sig_cell.add_paragraph()
    p_sig_text.paragraph_format.line_spacing = 1.15
    r_mname = p_sig_text.add_run("Marquis\n")
    r_mname.bold = True
    r_mname.font.size = Pt(10.5)
    r_mname.font.color.rgb = RGBColor(27, 77, 137)
    
    r_mtitle = p_sig_text.add_run("Human Resources & Talent Management\n"
                                 "EIB Stratoc Limited (EIB Group)\n"
                                 "Email: hr@eibstratoc.com")
    r_mtitle.font.size = Pt(9)
    r_mtitle.font.color.rgb = RGBColor(90, 100, 115)
    
    # Stamp side
    stamp_cell = sig_table.cell(0, 1)
    p_stamp = stamp_cell.paragraphs[0]
    p_stamp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    stamp_img_path = os.path.join(assets_dir, 'stamp_recreated_marquis.png')
    if os.path.exists(stamp_img_path):
        r_stamp_img = p_stamp.add_run()
        r_stamp_img.add_picture(stamp_img_path, width=Inches(2.5))
    
    doc.save(output_path)
    print(f"Letter saved to {output_path}")

def create_evaluation_form(output_path, assets_dir):
    doc = docx.Document()
    
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)
        
    # Header: Logo & Title
    head_table = doc.add_table(rows=1, cols=2)
    head_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    head_table.autofit = False
    head_table.columns[0].width = Inches(2.5)
    head_table.columns[1].width = Inches(4.37)
    
    # Logo
    c0 = head_table.cell(0, 0)
    logo_path = os.path.join(assets_dir, 'logo.png')
    if os.path.exists(logo_path):
        p_logo = c0.paragraphs[0]
        p_logo.add_run().add_picture(logo_path, width=Inches(1.8))
        
    # Title
    c1 = head_table.cell(0, 1)
    p_title = c1.paragraphs[0]
    p_title.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    
    r1 = p_title.add_run("EIB STRATOC LIMITED\n")
    r1.bold = True
    r1.font.size = Pt(13)
    r1.font.color.rgb = RGBColor(27, 77, 137)
    
    r2 = p_title.add_run("STUDENT INDUSTRIAL WORK EXPERIENCE SCHEME (SIWES)\n"
                         "END-OF-ATTACHMENT EMPLOYER'S EVALUATION & CLEARANCE REPORT\n")
    r2.bold = True
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = RGBColor(60, 70, 85)
    
    r3 = p_title.add_run("CONFIDENTIAL INDUSTRY-BASED SUPERVISOR'S ASSESSMENT FORM")
    r3.font.size = Pt(8)
    r3.italic = True
    r3.font.color.rgb = RGBColor(120, 130, 140)
    
    # Divider rule
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(4)
    p_div.paragraph_format.space_after = Pt(8)
    p_div.add_run("━" * 62).font.color.rgb = RGBColor(27, 77, 137)
    
    # Section 1: Trainee & Attachment Information
    p_s1 = doc.add_paragraph()
    p_s1.paragraph_format.space_before = Pt(2)
    p_s1.paragraph_format.space_after = Pt(4)
    r_s1 = p_s1.add_run("SECTION A: TRAINEE & ATTACHMENT PROFILE")
    r_s1.bold = True
    r_s1.font.size = Pt(10)
    r_s1.font.color.rgb = RGBColor(27, 77, 137)
    
    info_table = doc.add_table(rows=4, cols=4)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_table.autofit = False
    
    col_w = [Inches(1.5), Inches(2.1), Inches(1.5), Inches(1.77)]
    for row in info_table.rows:
        for idx, w in enumerate(col_w):
            row.cells[idx].width = w
            
    info_data = [
        [("Student Full Name:", True), ("[Student Name]", False), ("Matriculation No:", True), ("[Matric No]", False)],
        [("Institution:", True), ("[University / Polytechnic]", False), ("Faculty / School:", True), ("[Faculty of Science/Eng.]", False)],
        [("Department / Course:", True), ("[e.g. Computer Science]", False), ("Level / Year of Study:", True), ("400 Level (Undergraduate)", False)],
        [("Attachment Period:", True), ("14-Apr-2026 to 09-Oct-2026", False), ("Assigned Division:", True), ("Operations & Technology", False)],
    ]
    
    for r_idx, row in enumerate(info_data):
        for c_idx, (text, is_bold) in enumerate(row):
            cell = info_table.cell(r_idx, c_idx)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(text)
            run.font.size = Pt(8.5)
            run.bold = is_bold
            if is_bold:
                run.font.color.rgb = RGBColor(27, 77, 137)
                set_cell_background(cell, "F2F5F9")
            else:
                run.font.color.rgb = RGBColor(30, 40, 50)
                
    # Section B: Performance Appraisal Matrix
    p_s2 = doc.add_paragraph()
    p_s2.paragraph_format.space_before = Pt(8)
    p_s2.paragraph_format.space_after = Pt(4)
    r_s2 = p_s2.add_run("SECTION B: PERFORMANCE APPRAISAL MATRIX (RATING: 1 - 5)")
    r_s2.bold = True
    r_s2.font.size = Pt(10)
    r_s2.font.color.rgb = RGBColor(27, 77, 137)
    
    perf_table = doc.add_table(rows=8, cols=5)
    perf_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    perf_table.autofit = False
    
    pcol_w = [Inches(0.4), Inches(3.2), Inches(1.2), Inches(1.0), Inches(1.07)]
    for row in perf_table.rows:
        for idx, w in enumerate(pcol_w):
            row.cells[idx].width = w
            
    # Headers
    pheaders = ["S/N", "Performance Evaluation Criterion", "Score (Max 10)", "Rating", "Remarks"]
    for idx, text in enumerate(pheaders):
        c = perf_table.cell(0, idx)
        set_cell_background(c, "1B4D89")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if idx != 1 else WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    criteria = [
        ("1", "Punctuality, Regularity & Attendance Record", "10 / 10", "Excellent", "Always on time"),
        ("2", "Technical Competence & Application of Knowledge", "9 / 10", "Very Good", "Quick learner"),
        ("3", "Quality of Work, Accuracy & Attention to Detail", "9 / 10", "Very Good", "Thorough & neat"),
        ("4", "Initiative, Problem Solving & Creativity", "9 / 10", "Very Good", "Proactive attitude"),
        ("5", "Interpersonal Relationships & Team Collaboration", "10 / 10", "Excellent", "Harmonious team player"),
        ("6", "Compliance with Company Rules & Safety Standards", "10 / 10", "Excellent", "Zero infraction"),
        ("7", "Logbook Documentation & Report Presentation", "9 / 10", "Very Good", "Well structured"),
    ]
    
    for r_idx, row_vals in enumerate(criteria, start=1):
        bg = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_vals):
            c = perf_table.cell(r_idx, c_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=70, right=70)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [0, 2, 3] else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.size = Pt(8)
            if c_idx == 1:
                r.bold = True
                
    # Section C: Quantitative Summary & Remarks
    p_s3 = doc.add_paragraph()
    p_s3.paragraph_format.space_before = Pt(8)
    p_s3.paragraph_format.space_after = Pt(4)
    r_s3 = p_s3.add_run("SECTION C: OVERALL RATING & SUPERVISOR'S RECOMMENDATIONS")
    r_s3.bold = True
    r_s3.font.size = Pt(10)
    r_s3.font.color.rgb = RGBColor(27, 77, 137)
    
    rem_table = doc.add_table(rows=2, cols=2)
    rem_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rem_table.autofit = False
    rem_table.columns[0].width = Inches(4.37)
    rem_table.columns[1].width = Inches(2.5)
    
    c_rem = rem_table.cell(0, 0)
    set_cell_margins(c_rem, top=60, bottom=60, left=80, right=80)
    p_rem = c_rem.paragraphs[0]
    r_rem_label = p_rem.add_run("Industry Supervisor's Qualitative Remarks:\n")
    r_rem_label.bold = True
    r_rem_label.font.size = Pt(8.5)
    r_rem_label.font.color.rgb = RGBColor(27, 77, 137)
    r_rem_text = p_rem.add_run(
        "The trainee showed remarkable dedication, technical curiosity, and professionalism throughout the 6-month internship attachment. He completed all assigned tasks on schedule, worked well with the operations crew, and demonstrated strong leadership potential. Highly commended."
    )
    r_rem_text.font.size = Pt(8)
    
    c_score = rem_table.cell(0, 1)
    set_cell_margins(c_score, top=60, bottom=60, left=80, right=80)
    set_cell_background(c_score, "F2F5F9")
    p_sc = c_score.paragraphs[0]
    p_sc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sc_head = p_sc.add_run("TOTAL AGGREGATE SCORE\n")
    r_sc_head.bold = True
    r_sc_head.font.size = Pt(9)
    r_sc_val = p_sc.add_run("66 / 70 (94.3%)\n")
    r_sc_val.bold = True
    r_sc_val.font.size = Pt(14)
    r_sc_val.font.color.rgb = RGBColor(27, 77, 137)
    r_sc_grade = p_sc.add_run("GRADE: EXCELLENT (DISTINCTION)")
    r_sc_grade.bold = True
    r_sc_grade.font.size = Pt(8.5)
    r_sc_grade.font.color.rgb = RGBColor(34, 139, 34)
    
    # Merge row 1 for Section D: Official Authentication
    c_auth_left = rem_table.cell(1, 0)
    set_cell_margins(c_auth_left, top=60, bottom=60, left=80, right=80)
    p_auth = c_auth_left.paragraphs[0]
    r_auth_title = p_auth.add_run("Industry Supervisor / HR Clearance:\n")
    r_auth_title.bold = True
    r_auth_title.font.size = Pt(8.5)
    r_auth_title.font.color.rgb = RGBColor(27, 77, 137)
    
    # add marquis signature
    sig_path = os.path.join(assets_dir, 'marquis_signature.png')
    if os.path.exists(sig_path):
        p_auth.add_run().add_picture(sig_path, width=Inches(1.5))
        
    p_auth_sub = c_auth_left.add_paragraph()
    p_auth_sub.paragraph_format.space_before = Pt(2)
    p_auth_sub.paragraph_format.line_spacing = 1.15
    r_aname = p_auth_sub.add_run("Marquis\n")
    r_aname.bold = True
    r_aname.font.size = Pt(9.5)
    r_aname.font.color.rgb = RGBColor(27, 77, 137)
    r_atitle = p_auth_sub.add_run("Head of Human Resources & Talent Development\nEIB Stratoc Limited (EIB Group)")
    r_atitle.font.size = Pt(8)
    r_atitle.font.color.rgb = RGBColor(90, 100, 115)
    
    c_auth_right = rem_table.cell(1, 1)
    set_cell_margins(c_auth_right, top=60, bottom=60, left=80, right=80)
    p_st = c_auth_right.paragraphs[0]
    p_st.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    stamp_path = os.path.join(assets_dir, 'stamp_recreated_marquis.png')
    if os.path.exists(stamp_path):
        p_st.add_run().add_picture(stamp_path, width=Inches(2.2))
        
    doc.save(output_path)
    print(f"Evaluation form saved to {output_path}")

if __name__ == '__main__':
    base_dir = r"C:\Users\USER\.gemini\antigravity-ide\scratch\eib-internship-suite"
    assets_dir = os.path.join(base_dir, "assets")
    
    letter_out = os.path.join(base_dir, "EIB_Internship_Completion_Letter.docx")
    form_out = os.path.join(base_dir, "EIB_SIWES_Evaluation_Form.docx")
    
    create_completion_letter(letter_out, assets_dir)
    create_evaluation_form(form_out, assets_dir)
