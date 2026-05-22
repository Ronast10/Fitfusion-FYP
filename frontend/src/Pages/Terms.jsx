import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Policy.css";

export default function Terms() {
    return (
        <div className="policy-page">
            <Navbar />
            <div className="policy-content">
                <h1>Terms and Conditions</h1>
                
                <p>These terms and conditions (“Agreement”) set forth the general terms and conditions of your use of the fitfusion.com.np website (“Website” or “Service”) and any of its related products and services (collectively, “Services”). This Agreement is legally binding between you (“User”, “you” or “your”) and FitFusion (“FitFusion”, “we”, “us” or “our”).</p>
                
                <p>If you are entering into this agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this agreement, in which case the terms “User”, “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this agreement, you must not accept this agreement and may not access and use the Website and Services. By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement.</p>

                <h3>Accounts and membership</h3>
                <p>If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. We may, but have no obligation to, monitor and review new accounts before you may sign in and start using the Services. Providing false contact information of any kind may result in the termination of your account.</p>
                <p>You must immediately notify us of any unauthorized uses of your account or any other breaches of security. We may suspend, disable, or delete your account (or any part thereof) if we determine that you have violated any provision of this Agreement or that your conduct or content would tend to damage our reputation and goodwill.</p>
                
                <h3>Links to other resources</h3>
                <p>Although the Website and Services may link to other resources (such as websites, mobile applications, etc.), we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked resource, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their resources.</p>

                <h3>Changes and amendments</h3>
                <p>We reserve the right to modify this Agreement or its terms related to the Website and Services at any time at our discretion. When we do, we will post a notification on the main page of the Website. An updated version of this Agreement will be effective immediately upon the posting of the revised Agreement unless otherwise specified.</p>

                <h3>Acceptance of these terms</h3>
                <p>You acknowledge that you have read this Agreement and agree to all its terms and conditions. By accessing and using the Website and Services you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorized to access or use the Website and Services.</p>
                
                <h3>Contacting us</h3>
                <p>If you have any questions, concerns, or complaints regarding this Agreement, we encourage you to contact us using the details below:</p>
                <p>

                    <strong>Email:</strong> info@fitfusion.com.np
                </p>
            </div>
            <Footer />
        </div>
    );
}