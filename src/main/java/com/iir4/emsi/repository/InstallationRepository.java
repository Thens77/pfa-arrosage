package com.iir4.emsi.repository;

import com.iir4.emsi.domain.Installation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Installation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InstallationRepository extends JpaRepository<Installation, Long> {}
